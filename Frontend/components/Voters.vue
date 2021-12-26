<template>
  <div class="row">
    <div class="col-md-3" v-for="voter in voters" :key="voter.id">
      <Voter class=" px-5 py-2" :voter="voter" @voted="$emit('voted', voter)" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["voters"],
  created() {
  },
};
</script>
 <style lang="scss" scoped>
</style>>