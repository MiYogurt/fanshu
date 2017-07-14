<template>
  <div class="container">
    <h3 class="title is-3">发布一篇新的文章</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="文章分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择文章分类">
          <el-option v-for="cate in categorys" :key="cate.id" :label="cate.get('name')" :value="cate">{{ cate.get('name') }}</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>

      <div class="el-form-item is-required" :class="{ 'is-error': validate.error }">
        <label class="el-form-item__label">文章内容</label>
        <div class="el-form-item__content">
          <div id="editor"></div>
          <div v-if="validate.error" class="el-form-item__error">正文怎能没有内容呢？</div>
        </div>
      </div>

      <div class="oprator right">
        <el-button class="submit" type="primary" @click="submit" @keyup.enter="submit">发布文章</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>

import { mapState } from 'vuex';

let editor = null;

export default {

  name: 'create',

  data () {
    return {
      categorys: [],
      form: {
        category: null,
        title: '',
      },
      rules: {
        title: [
          { required: true, message: "必须填写标题哦!", trigger: 'blur' },
        ],
        category: [
          { type: 'object', required: true, message: "必须填写分类哦!", trigger: 'blur' },
        ],

      },

      validate: {
        error: false
      }
    };
  },
  created(){
    this.getCategory();
  },
  mounted(){
    this.initEditor();
  },
  computed: mapState(['user']),
  methods: {
    content(){
      return editor.$txt.html();
    },
    initEditor(){
      let E = window.wangEditor;
      editor = new E('editor')

      editor.config.menus = $.map(wangEditor.config.menus, function(item, key) {
          // https://www.kancloud.cn/wangfupeng/wangeditor2/113975 请看这里
          if (item === 'location') {
              return null;
          }
          return item;
      });

      editor.create();

      editor.onchange = () => {
        this.validateContent();
      }

    },
    getCategory(){
      const cq = new this.$api.SDK.Query('Category');
      cq.find().then((categorys) => {
        this.categorys = categorys;
        this.form.category = categorys[0];
        this.$Progress.finish();
      }).catch(console.error)
    },

    validateContent(){
      if (this.content() == '<p><br></p>') {
        this.validate.error = true;
        $('.wangEditor-container').css({borderColor:'red'})
        return false;
      }

      this.validate.error = false;
      $('.wangEditor-container').css({borderColor:'#ccc'})
      return true;
    },

    createArticle(){
      const article = new this.$api.SDK.Object('Article');
      article.set('author', this.user);
      article.set('title', this.form.title);
      article.set('content', this.content());
      article.set('category', this.form.category);
      return article;
    },

    setACL(article){
      // 设置访问权限
      // https://leancloud.cn/docs/acl-guide.html#单用户权限设置
      let acl = new this.$api.SDK.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(this.user,true);
      article.setACL(acl);
    },

    save(article){
      article.save().then((article) => {
        console.log(article);
        const message =  `文章《${article.get('title')}》发布成功`;
        this.$message({message, type: 'success'});
        this.$router.replace({name:"ArticleShow", params: { id: article.id }});
      }).catch(console.error);
    },

    submit(){
      this.$refs.form.validate((valid) => {
        const me = this.validateContent();
        if (valid && me) {
          const article = this.createArticle();
          this.setACL(article);
          this.save(article);
        } else {
          console.log('error submit!!');
          this.$message.error('错了哦，您填写的信息有错误，请按照提示修改。');
          return false;
        }
      })

    }
  },
};
</script>

<style lang="css" scoped>
.oprator{
  margin-top: 20px;
  float: right;
}
#editor{
  min-height: 300px;
}
</style>
