<template>
    <my-page title="支付" :page="page">
        <div class="common-container container">
            <app-list :data="groups" />
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                groups: [
                    {
                        // name: '初等',
                        apps: [
                            {
                                name: '我的余额',
                                desc: '',
                                icon: '/static/img/encrypt.svg',
                                to: '/money'
                            },
                            {
                                name: '我的硬币',
                                desc: '',
                                icon: '/static/img/encrypt.svg',
                                to: '/coin'
                            },
                        ]
                    }
                ],
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://app.yunser.com?utm_source=pay',
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
