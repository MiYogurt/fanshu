<template>
  <div class="container">
    <h2>我的粉丝</h2>
    <ul v-if="followers.length">
      <li v-for="follower in followers" > <router-link :to="{ name: 'User', params: { id: follower.id } }">{{ follower.get('username') }}</router-link></li>
    </ul>
    <span v-else>你没有粉丝</span>

  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {

  name: 'myFollower',

  data () {
    return {
      followers: []
    };
  },
  computed: mapState(['user']),
  created(){
    this.getFollower();
  },
  methods:{
    getFollower(){
      const q = this.user.followerQuery();
      q.include('follower');
      q.find().then((followers) => {
        this.followers = followers;
        this.$Progress.finish()
      }).catch(console.log);
    }
  }


};
</script>

<style lang="css" scoped>
</style>
