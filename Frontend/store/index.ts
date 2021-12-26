import { GetterTree, ActionTree, MutationTree } from 'vuex'
import getWeb3 from '../utils/getWeb3';
import contractInstance from '..//utils/getContractInstance';
import Web3Data from '~/models/Web3Data';
import voters from '~/mock-data/voters';
export const state = () => ({
    web3: new Web3Data(),
    contractInstance: null,
    chairPerson: null,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    web3: state => state.web3,
    contractInstance: state => state.contractInstance,
    chairPerson: state => state.chairPerson
}

export const mutations: MutationTree<RootState> = {
    registerWeb3Instance(state, payload) {
        let result = payload
        let web3Copy = state.web3
        web3Copy.coinbase = result.coinbase.toLowerCase()
        web3Copy.networkId = result.networkId
        web3Copy.accounts = result.accounts
        web3Copy.balance = parseInt(result.balance, 10)
        web3Copy.isInjected = result.injectedWeb3
        web3Copy.web3Instance = result.web3
        web3Copy.currentAccount = web3Copy.coinbase
        state.web3 = web3Copy
    },
    contractInstance(state, payload) {
        state.contractInstance = payload;
    },
    chairPerson(state, payload) {
        state.chairPerson = payload;
    }
}

export const actions: ActionTree<RootState, RootState> = {
    async registerWeb3({ commit, getters }) {
        console.log("commit('registerWeb3Instance', result)");
        
        getWeb3.then((result: any) => {
            commit('registerWeb3Instance', result);
        }).catch(e => {
            console.log('error in action registerWeb3', e)
        })
    },
    async getContractInstance({ commit }) {
        await contractInstance.then(async (res: any) => {
            commit('contractInstance', res);
            await res.chairperson.then((ch: any) => {
                commit('chairPerson', ch.toLowerCase());
            })
        })
    },
    async registerAccount({ commit, getters }, payload) {
        const contract = getters["contractInstance"];
        const currentAccount = getters["web3"]["currentAccount"];
        contract.vote.defaults({ from: currentAccount });
        return new Promise((resolve, reject) => {
            contract.vote.deployed().then((instance: any) => {
                resolve(instance);
            })
        }).then((result: any) => {
            return new Promise((resolve, reject) => {
                result.register(payload, { from: currentAccount }).then((res: any) => {
                    resolve(res)
                })
            })
        })
    },
    async vote({commit, getters}, payload){
        const contract = getters["contractInstance"];
        const currentAccount = getters["web3"]["currentAccount"];
        contract.vote.defaults({ from: currentAccount });
        return new Promise((resolve, reject) => {
            contract.vote.deployed().then((instance: any) => {
                resolve(instance);
            })
        }).then((result: any) => {
            return new Promise((resolve, reject) => {
                result.vote(payload, { from: currentAccount }).then((res: any) => {
                    resolve(res)
                })
            })
        })
    },
    async getWinner({commit, getters}){
        const contract = getters["contractInstance"];
        const currentAccount = getters["web3"]["currentAccount"];
        contract.vote.defaults({ from: currentAccount });
        return new Promise((resolve, reject) => {
            contract.vote.deployed().then((instance: any) => {                
                resolve(instance);
            })
        }).then((result: any) => {
            return new Promise((resolve, reject) => {
                result.winningProposal().then((res: any) => {
                    resolve(res)
                })
            })
        })
    },
    resetStore({commit}){
        commit('registerWeb3Instance',new Web3Data());
        commit('contractInstance', null);
        commit('chairPerson', null);
    }
}