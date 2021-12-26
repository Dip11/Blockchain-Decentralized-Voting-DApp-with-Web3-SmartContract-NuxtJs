<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <div
          v-if="successMessage"
          data-delay="1000"
          class="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {{ successMessage }}
        </div>
        <div
          v-if="errorMessage"
          data-delay="1000"
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button
          v-if="!currentAccount"
          class="btn btn-primary float-right"
          @click="connectToWallet()"
        >
          Connect to your Wallet
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 text-center">
        <h2>Choose Your Voter</h2>
        <hr />
        <Voters :voters="voters" @voted="voted" />
      </div>
    </div>
    <div class="row mt-5">
      <div class="col-md-6">
        <div v-if="currentAccount && currentAccount == chairPerson">
          <div>
            <h6>Input Account Address to Register</h6>
            <input class="form-control" type="text" v-model="inputAccount" />
          </div>
          <button
            :disabled="!inputAccount"
            class="btn btn-primary mt-2"
            @click="register()"
          >
            Register
          </button>
        </div>
      </div>
      <div v-if="currentAccount" class="col-md-6">
        <button class="btn btn-success float-right" @click="getWinner()">Get the Winner</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Voters from "~/components/Voters.vue";
import voters from "../mock-data/voters";
declare var window: any;

export default Vue.extend({
  components: { Voters },
  data() {
    return {
      voters: voters,
      inputAccount: this.$store.getters["web3"]["currentAccount"],
      successMessage: "",
      errorMessage: "",
    };
  },
  created() {
    window.ethereum.on("accountsChanged", async (accounts: any) => {
      this.$store.dispatch("resetStore");
      this.$router.go(0);
    });
  },
  computed: {
    accounts: function () {
      return this.$store.getters["web3"]["accounts"];
    },
    chairPerson: function () {
      return this.$store.getters["chairPerson"];
    },
    currentAccount: function () {
      return this.$store.getters["web3"]["currentAccount"];
    },
  },
  methods: {
    async connectToWallet() {
      await this.$store.dispatch("registerWeb3");
      await this.$store.dispatch("getContractInstance");
    },
    async register() {
      let reg = await this.$store.dispatch(
        "registerAccount",
        this.inputAccount
      );
      try {
        if (reg.receipt.status == "0x01") {
          this.successMessage =
            this.inputAccount + " is registered successfully.";
          this.errorMessage = "";
        } else {
          this.errorMessage =
            this.inputAccount + " account registeration failed due to revert.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage =
          this.inputAccount + " account registeration failed.";
        this.successMessage = "";
      }
    },
    async voted(votedTo: any) {
      let res = await this.$store.dispatch("vote", votedTo.id);
      try {
        if (res.receipt.status == "0x01") {
          this.successMessage =
            this.inputAccount + " voting done successfully.";
          this.errorMessage = "";
        } else {
          this.errorMessage =
            this.inputAccount + " voting not done successfully due to revert.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = this.inputAccount + " voting failed.";
        this;
      }
    },
    async getWinner() {
      let res = await this.$store.dispatch("getWinner");
      try {
        if (res) {
          let winner = this.voters.find(voter => voter.id == res) || res;
          this.successMessage =
            winner.name + " has won the Election";
          this.errorMessage = "";
        } else {
          this.errorMessage =
            res + " voting not done successfully due to revert.";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = res + " voting failed.";
        this;
      }
    },
    coinbaseAccount(account: string) {
      return this.currentAccount === account.toLowerCase()
        ? "(Current Account)"
        : "";
    },
  },
});
</script>
