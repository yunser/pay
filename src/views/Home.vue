<template>
    <my-page title="密码" :page="page">
        <div class="common-container container">
            <app-list :data="groups" />
        </div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                groups: [
                    {
                        // name: '初等',
                        apps: [
                            {
                                name: '密码管理',
                                desc: '',
                                icon: '/static/img/encrypt.svg',
                                to: '/manage'
                            },
                            {
                                name: '密码生成',
                                desc: '',
                                icon: '/static/img/encrypt.svg',
                                to: '/password/generator'
                            },
                            {
                                name: '随机密码',
                                desc: '',
                                icon: '/static/img/encrypt.svg',
                                to: '/tool'
                            }
                        ]
                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'search',
                            href: 'https://search.yunser.com?utm_source=password',
                            target: '_blank',
                            title: '搜索'
                        },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=password',
                            target: '_blank',
                            title: '应用'
                        }
                    ]
                }
            }
        },
        computed: {
        },
        mounted() {
        },
        methods: {
            init() {
            },
            fileChange(e) {
            },
            sizeStr: function (size) {
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
