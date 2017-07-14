<template>
  <div class="container">

    <ul v-if="statuses.length">
      <li v-for="status in statuses">
        <router-link :to="{name:'User', params: { id: status.get('source').id  }}">{{ status.get('source').get('username') }}</router-link> 在 {{ status.createdAt }}
        <span v-if="status.get('type') == 'create_article' ">
          创建了新的文章 <router-link :to="{ name: 'ArticleShow', params:{ id: status.get('article').id } }">{{ status.get('article').get('title') }}</router-link>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {

  name: 'friend',

  data () {
    return {
      statuses: {}
    };
  },
  created(){
    this.getFriendMsg();
  },
  methods: {
    getFriendMsg(){
      const followeesQ = this.$store.state.user.followeeQuery();
      followeesQ.find().then(followees => {
          console.log(followees);
          const query = new this.$api.SDK.Query('_Status');
          query.include('source');
          query.include('article');
          query.equalTo('inboxType', 'friend');
          query.containedIn('source', followees);
          return query.find();
      }).then((statuses) => {
        //查询成功，返回状态列表，每个对象都是 AV.Status
        this.statuses = statuses;
        this.$Progress.finish();
        console.dir(statuses);
      }, (err) => {
        //查询失败
        console.dir(err);
      });

    }
  }
};
</script>

<style lang="css" scoped>
</style>

