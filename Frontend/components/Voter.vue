<template>
  <div class="card" style="width: 18rem">
    <img :src="voter.picture" alt="" srcset="" />
    <br />
    <h5>{{ voter.name }}</h5>
    <button class="btn btn-primary" @click="voteButtonClicked(voter)">
      Vote
    </button>
  </div>
</template>

<script>
export default {
  props: ["voter"],
  methods: {
    voteButtonClicked(voter) {
      this.$emit("voted", voter);
    },
  },
};
</script>

<style>
</style>