<template>
  <div class="container">
    <h2>我的消息</h2>
    <ul v-if="messages.length">
      <li v-for="(message, index) in messages" > <router-link :to="{ name: 'User', params: { id: message.get('from').id } }">{{ message.get('from').get('username') }}</router-link> 给你发了一条信息
        <p>
          <button @click="destroy(index)">删除</button>
          <button @click="send(message.get('from'))">回复</button>
        </p>

        <p>{{ message.get('message') }}</p>
      </li>
    </ul>
    <span v-else>没有消息</span>

    <el-dialog title="发送私信给该用户" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" label-width="80px" label-position="top" :rules="rules">
        <el-form-item label="私信内容" prop="msg">
          <el-input type="textarea" v-model="form.msg"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="sendMsg()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {

  name: 'message',

  data () {
    return {
      messages: [],
      sendTo: null,
      dialogFormVisible: false,
      form: {
        msg: ''
      },
      rules:{
        msg: [
          { required: true, message:'必填项', trigger: 'blur' },
        ]
      }
    }
  },
  created(){
    this.getMessages();
  },
  methods: {
    getMessages(){
      const q = new this.$api.SDK.Query('_Status');
      q.include('from');
      q.equalTo('to', this.$store.state.user)
      q.equalTo('inboxType', 'private');
      q.find().then((messages) => {
        console.log(messages)
        this.messages = messages;
        this.$Progress.finish()
      }).catch((err) => {
        this.$messages.error(err);
      })

      //.catch(this.$message.error)
    },
    send(from){
      this.sendTo = from;
      this.dialogFormVisible = true;
    },
    sendMsg(){
      if (!this.form.msg) {
        this.$message.error("信息不能为空");
        return;
      }
      const Status = this.$api.SDK.Status;
      const status = new Status(null, this.form.msg);
      const fromUser = this.$store.state.user;
      status.set('from', fromUser);
      status.set('to', this.sendTo);
      Status.sendPrivateStatus(status, this.sendTo).then((status) => {
        if (status) {
          this.dialogFormVisible = false;
          this.$message({message:'发送私信成功！', type:'success'});
          console.log(status)
        }
      },(err) =>{
        this.$message.error(err);
      })
    },
    destroy(index){
      console.log(index)
      this.messages[index].destroy().then((status) => {
        if (status) {
          this.messages.splice(index, 1);
          this.$messages({ messages: '删除成功', type:'success' });
        }
      })
    }

  }
};
</script>

<style lang="css" scoped>
</style>
