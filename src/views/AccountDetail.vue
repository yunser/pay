<template>
    <my-page title="账号详情" :page="page" backable>
        <div class="common-container container">
            <div v-if="account" class="account">
                <div class="title">
                    <router-link :to="`/accounts/${account.id}`">{{ account.title }}</router-link>
                </div>
                <ul class="meta-list">
                    <li class="item">
                        <div class="name">账号：</div>
                        <div class="content">
                            {{ account.account || '无' }}
                            <a class="item-btn btn-copy btn-link" href="javascript:;" :data-clipboard-text="account.account" v-if="account.account">复制</a>
                        </div>
                    </li>
                    <li class="item">
                        <div class="name">密码：</div>
                        <div class="content">
                            {{ passwordVisible ? account.password : '******' }}
                            <br>
                            <a class="item-btn btn-copy btn-link" href="javascript:;" :data-clipboard-text="account.password">复制</a>
                            <a class="item-btn btn-link" href="javascript:;" @click="togglePassword">{{ passwordVisible ? '隐藏' : '显示' }}</a>
                            <!-- {{ account.password }} -->
                            <!-- <span class="password2" v-if="account.type === ''">{{ account.password }}</span> -->
                            <!-- <span class="password2" v-if="account.type !== ''">{{ key ? decrypt(account.password) : '请输入密钥'}}</span> -->
                        </div>
                    </li>
                    <li class="item">
                        <div class="name">备注：</div>
                        <div class="content">
                            {{ account.note }}
                        </div>
                    </li>
                    <li class="item">
                        <div class="name">网址：</div>
                        <div class="content">
                            <a :href="account.url" target="_blank">{{ account.url }}</a>
                            <a class="item-btn btn-copy btn-link" href="javascript:;" :data-clipboard-text="account.url">复制</a>
                        </div>
                    </li>
                    <li class="item">
                        <div class="name">标签：</div>
                        <div class="content">
                            {{ account.tags }}
                        </div>
                    </li>
                </ul>
                <!-- <div>加密类型：{{ account.type || '-'}} </div> -->
                <div class="btns">
                    <ui-raised-button class="btn btn-copy" label="复制账号密码" :data-clipboard-text="shareText" />
                    <ui-raised-button class="btn" label="查看同站点账号" @click="viewSameDomain" v-if="account.url" />
                </div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    import { access } from 'fs';
    const CryptoJS = window.CryptoJS
    const Clipboard = window.Clipboard

    export default {
        data () {
            return {
                shareText: '',
                key: '',
                account: null,
                passwordVisible: false,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'edit',
                            click: this.edit,
                            title: '编辑'
                        },
                        {
                            type: 'icon',
                            icon: 'delete',
                            click: this.remove,
                            title: '删除'
                        },
                    ]
                }
            }
        },
        mounted() {
            this.init()

            this.clipboard = new Clipboard('.btn-copy')
            this.clipboard.on('success', e => {
                console.info('Action:', e.action)
                console.info('Text:', e.text)
                console.info('Trigger:', e.trigger)
                e.clearSelection()
                this.$message({
                    type: 'success',
                    text: '已复制'
                })
            })
            this.clipboard.on('error', function (e) {
                console.error('Action:', e.action)
                console.error('Trigger:', e.trigger)
            })
        },
        filters: {
        },
        methods: {
            init() {
                this.accountId = this.$route.params.id
                this.key = this.$storage.get('key', '')
                this.loadData()
            },
            loadData() {
                if (!this.accountId) {
                    return
                }
                this.$http.get(`/password/accounts/${this.accountId}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.account = data
                        if (this.account.type === '3DES') {
                            this.account.password = CryptoJS.TripleDES.decrypt(this.account.password, this.key).toString(CryptoJS.enc.Utf8)
                        }
                        let account = this.account.account || '无'
                        let password = this.account.password || '无'
                        let url = this.account.url
                        this.shareText = `账号：${account}\n密码：${password}`
                        if (url) {
                            this.shareText += `\n网址：${url}`
                        }
                        console.log('this.shareText', this.shareText)
                    },
                    response => {
                        console.log(response)
                    })
            },
            togglePassword() {
                this.passwordVisible = !this.passwordVisible
            },
            viewSameDomain() {
                let domain = this.account.url
                let arr = this.account.url.split('/').filter(item => item)
                console.log(arr[1])
                console.log(domain)
                this.$router.push(`/manage?keyword=${arr[1]}`)
            },
            edit() {
                this.$router.push(`/accounts/${this.accountId}/edit`)
            },
            remove() {
                let ret = confirm(`确认删除「${this.account.title}」?`)
                if (!ret) {
                    return
                }
                this.$http.delete(`/password/accounts/${this.account.id}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.$router.go(-1)
                    },
                    response => {
                        console.log(response)
                    })
            },
            decrypt(text) {
                console.log('jiemi', text, this.key, CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8))
                return CryptoJS.TripleDES.decrypt(text, this.key || '').toString(CryptoJS.enc.Utf8)
            }
        }
    }
</script>

<style lang="scss" scoped>
.account {
    .title {
        margin-bottom: 16px;
        font-size: 16px;
        font-weight: bold;
    }
}
.meta-list {
    .item {
        display: flex;
        margin-bottom: 8px;
    }
    .name {
        width: 60px;
    }
}
.column-title {
    width: 240px;
}
.column-account {
    width: 240px;
}
.column-password {
    width: 240px;
}
.password-box {
    &:hover {
        .password {
            display: block;
        }
    }
    .password {
        display: none;
    }
}
.btn-copy {
    
}
.btns {
    margin-top: 24px;
    .btn {
        margin-right: 8px;
    }
}
</style>
