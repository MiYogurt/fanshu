<template>
<div class="container">
  <template v-if="article">
    <h2>{{ article.get('title') }}</h2>
    <div class="oprator" v-if="uid == article.get('author').id">
      <router-link :to="{ name:'ArticleEdit', params: {id: article.id} }" tag="button">修改</router-link >
      <button @click="destroy">删除</button>
    </div>

    <div class="container">
      <span> author {{ article.get('author').get('username') }}</span> <br>
      <span> cate {{ article.get('category').get('name') }}</span>
    </div>

    <div class="content" v-html="article.get('content')"></div>
  </template>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {

  name: 'index',

  data () {
    return {
      article: null
    };
  },
  created(){
    const id = this.$route.params.id;
    this.getArticle(id);
  },
  computed: {
    ...mapGetters(['uid'])
  },
  methods: {
    getArticle(id){
      const q = new this.$api.SDK.Query('Article');
      q.include('author');
      q.include('category');
      q.get(id).then((article) => {
        this.article = article;
        this.$Progress.finish();
      }).catch(console.log)
    },
    destroy(){
      this.article.destroy().then(() => {
        this.$message({type:'success', message: '删除成功'});
        this.$router.replace({path:'/article?type=all'});
      })
    }
  }
};
</script>

<style lang="css" scoped>
</style>
