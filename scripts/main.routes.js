(function () {
    function routes($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $provide, $compileProvider, $ocLazyLoadProvider) {
        //$locationProvider.html?ver=3.805Mode({
        //	enabled: true,
        //	requireBase: false
        //});
        //$locationProvider.html5Mode(true);
        $ocLazyLoadProvider.config({
            debug: false,
            cache: true
        });
        var defaultsCache = true;
        if (location.host.indexOf("localhost") !== -1 || location.host == '172.25.20.31' || location.host == 'adm.bizibox.biz' || location.host == 'adm-stg.bizibox.biz' || location.host == '172.25.100.31' || location.host == 'stg-adm.bizibox.biz' || location.host == '10.200.140.31' || location.host == '192.168.10.116' || location.pathname == '/adm/') {
            defaultsCache = true;
        }

        $httpProvider.defaults.cache = true;

        $stateProvider
            .state('login', {
                url: "/login",
                cache: true,
                data: {pageTitle: 'כניסה למערכת ביזיבוקס'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'loginCtrl',
                        templateUrl: 'views/login.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/loginCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('login.url', {
                url: "/:url"
            })
            .state('promo', {
                url: "/promo",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'loginCtrl',
                        templateUrl: 'views/promo.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/loginCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('signup', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'signupCtrl',
                        templateUrl: 'views/signup.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/signupCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('signup.step1', {
                url: "signup",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/signup/step1.html?ver=3.80"
                    }
                },
                data: {pageTitle: 'bizibox'}
            })
            .state('signup.step2', {
                url: "signup/step2",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/signup/step2.html?ver=3.80"
                    }
                },
                data: {pageTitle: 'bizibox'}
            })
            .state('signup.step3', {
                url: "signup/step3",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/signup/step3.html?ver=3.80"
                    }
                },
                data: {pageTitle: 'bizibox'}
            })
            .state('alerts', {
                url: "/alerts",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'alertsCtrl',
                        templateUrl: 'views/allAlerts.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/alertsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('forgotPassword', {
                url: "/forgotPassword",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'forgotPasswordCtrl',
                        templateUrl: 'views/forgotPassword.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/forgotPasswordCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('settings', {
                url: "/settings",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'settingsCtrl',
                        templateUrl: 'views/settings.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/settingsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('settings.accounts', {
                url: "/accounts",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.accounts.html?ver=3.80"
                    }
                },
                data: {pageTitle: 'bizibox'}
            })
            .state('settings.changePassword', {
                url: "/changePassword",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.changePassword.html?ver=3.80"
                    }
                },
                data: {pageTitle: 'bizibox'}
            })
            .state('settings.alerts', {
                url: "/alerts",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.alerts.html?ver=3.80"
                    }
                }
            })
            .state('settings.cards', {
                url: "/cards",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.cards.html?ver=3.80"
                    }
                }
            })
            .state('settings.about', {
                url: "/about",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.about.html?ver=3.80"
                    }
                }
            })
            .state('settings.companies', {
                url: "/companies",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.companies.html?ver=3.80"
                    }
                }
            })
            .state('settings.users', {
                url: "/users",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.users.html?ver=3.80"
                    }
                }
            })
            .state('settings.payments', {
                url: "/payments",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.payments.html?ver=3.80"
                    }
                }
            })
            .state('settings.paymentsDetails', {
                url: "/details",
                abstract: true,
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.payments.payments.html?ver=3.80"
                    }
                }
            })
            .state('settings.paymentsDetails.details', {
                url: "/",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.payments.details.html?ver=3.80"
                    }
                }
            })
            .state('settings.paymentsDetails.clients', {
                url: "/clients",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.payments.clients.html?ver=3.80"
                    }
                }
            })
            .state('settings.paymentsDetails.potentialCustomers', {
                url: "/potentialCustomers",
                cache: true,
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/settings.payments.potentialCustomers.html?ver=3.80"
                    }
                }
            })
            .state('regularOperations', {
                url: "/regularOperations",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'regularOperationsCtrl',
                        templateUrl: 'views/regularOperations.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/regularOperationsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('periodical', {
                url: "/periodical",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'periodicalCtrl',
                        templateUrl: 'views/periodical.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/periodicalCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('fundManagement', {
                url: "/funds",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'fundMGMTCtrl',
                        templateUrl: 'views/funds.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/fundMGMTCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('fundManagement.bankAccounts', {
                url: "/accounts",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'fundMGMTAccountsCtrl',
                        templateUrl: 'views/fundMGMTAccounts.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/fundMGMTAccountsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('fundManagement.bankAccounts.table', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/fundBankAccountsTable.html?ver=3.80"
                    }
                }
            })
            .state('fundManagement.bankAccounts.graph', {
                url: "/graph",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/fundBankAccountsGraph.html?ver=3.80"
                    }
                }
            })
            .state('fundManagement.slika', {
                url: "/slika",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'fundMGMTSlikaCtrl',
                        templateUrl: 'views/fundMGMTSlika.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/fundMGMTSlikaCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('fundManagement.slika.table', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: 'views/fundSlikaTable.html?ver=3.80'
                    }
                }
            })
            .state('fundManagement.slika.graph', {
                url: "/graph",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/fundSlikaGraph.html?ver=3.80"
                    }
                }
            })
            .state('fundManagement.cards', {
                url: "/cards",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'fundMGMTCardsCtrl',
                        templateUrl: 'views/fundMGMTCards.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/fundMGMTCardsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('fundManagement.cards.table', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/fundCardsTable.html?ver=3.80"
                    }
                }
            })
            .state('fundManagement.cards.graph', {
                url: "/graph",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/fundCardsGraph.html?ver=3.80"
                    }
                }
            })
            .state('general', {
                url: "/general",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'generalCtrl',
                        templateUrl: 'views/general.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/generalCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('general.funds', {
                url: "/funds",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'generalFundsCtrl',
                        templateUrl: 'views/generalFunds.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/generalFundsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('general.funds.bank', {
                url: "/:bank",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: 'views/generalFunds.html?ver=3.80'
                    }
                }
            })
            .state('general.accountant', {
                url: "/generalAccountant",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'generalAccountant',
                        templateUrl: 'views/generalAccountant.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/generalAccountant.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('tazrim', {
                url: "/tazrim",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'tazrimCtrl',
                        templateUrl: 'views/tazrim.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/tazrimCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('analysis', {
                url: "/analysis",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'analysisCtrl',
                        templateUrl: 'views/analysis.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/analysisCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('trialBalance', {
                url: "/trialBalance",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'trialBalanceCtrl',
                        templateUrl: 'views/trialBalance.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/trialBalanceCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('bankMatch', {
                url: "/bankMatch",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'bankMatchCtrl',
                        templateUrl: 'views/bankMatch.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/bankMatchCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('bankMatch.set', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/setBankMatch.html?ver=3.80"
                    }
                }
            })
            .state('bankMatch.cancel', {
                url: "/cancel",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/cancelBankMatch.html?ver=3.80"
                    }
                }
            })
            .state('tazrimMeuhad', {
                url: "/tazrimMeuhad",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'tazrimMeuhadCtrl',
                        templateUrl: 'views/tazrimMeuhad.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/tazrimMeuhadCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('tazrimMeuhad.table', {
                url: "/tazrimMeuhadTable",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/tazrimMeuhadTable.html?ver=3.80"
                    }
                }
            })
            .state('tazrimMeuhad.graph', {
                url: "/tazrimMeuhadGraph",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/tazrimMeuhadGraph.html?ver=3.80"
                    }
                }
            })
            .state('regularOp', {
                url: "/regularOp",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'regularOpCtrl',
                        templateUrl: 'views/regularOp.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/regularOpCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('regularOp.cube', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/regularOpCube.html?ver=3.80"
                    }
                }
            })
            .state('regularOp.graph', {
                url: "/graph",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/regularOpGraph.html?ver=3.80"
                    }
                }
            })
            .state('regularOp.table', {
                url: "/table",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/regularOpTable.html?ver=3.80"
                    }
                }
            })
            .state('report', {
                url: "/report",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'reportCtrl',
                        templateUrl: 'views/report.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/reportCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('checksAnalysis', {
                url: "/checksAnalysis",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'checksAnalysisCtrl',
                        templateUrl: 'views/checksAnalysis.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/checksAnalysisCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants', {
                url: "/mainAccountants",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'mainAccountCtrl',
                        templateUrl: "views/mainAccountants.html?ver=3.80"
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/mainAccountCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.main', {
                url: "/main",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'mainAccountantsCtrl',
                        templateUrl: "views/mainAcc.html?ver=3.80"
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/mainAccountantsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.companys', {
                url: "/companys",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'companysCtrl',
                        templateUrl: 'views/companys.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/companysCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.companys.cube', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/companysCube.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.companys.table', {
                url: "/table",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/companysTable.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.exportHashv', {
                url: "/exportHashv",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'exportHashvCtrl',
                        templateUrl: 'views/exportHashv.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/exportHashvCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.ocrLandingPageSupplier', {
                url: "/ocrLandingPageSupplier",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'ocrLandingPageCtrl',
                        templateUrl: 'views/ocrLandingPage.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/ocrLandingPageCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.ocrLandingPageBank', {
                url: "/ocrLandingPageBank",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'ocrLandingPageCtrl',
                        templateUrl: 'views/ocrLandingPage.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/ocrLandingPageCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.managementTeam', {
                url: "/managementTeam",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'managementTeamCtrl',
                        templateUrl: 'views/managementTeam.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/managementTeamCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.mainAccountantsCards', {
                url: "/cards",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'mainAccountantsCardsCtrl',
                        templateUrl: 'views/mainAccountantsCards.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/mainAccountantsCardsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.managerAcc', {
                url: "/managerAcc",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'managerAccCtrl',
                        templateUrl: 'views/managerAcc.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/managerAccCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.managerAcc.companyDetails', {
                url: "/companyDetails",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/mainAccountants.managerAcc.companyDetails.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.managerAcc.office', {
                url: "/office",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/mainAccountants.managerAcc.office.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.reports', {
                url: "/reports",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'reportsAccCtrl',
                        templateUrl: 'views/reportsAcc.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/reportsAccCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.reports.main', {
                url: "/main",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/reportsAccMain.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.reports.expenseMissingReportTable', {
                url: "/expenseMissingReportTable",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/expenseMissingReportTable.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.reports.expenseChangedReportTable', {
                url: "/expenseChangedReportTable",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/expenseChangedReportTable.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.reports.typing', {
                url: "/typingReportTable",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/typingReportTable.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.reports.match', {
                url: "/matchReportTable",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/matchReportTable.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.bankDataManagement', {
                url: "/bankDataManagement",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'bankDataManagementCtrl',
                        templateUrl: 'views/bankDataManagement.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/bankDataManagementCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.bankDataManagement.view', {
                url: "/view",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/mainBankDataManagementView.html?ver=3.80"
                    }
                }
            })
            .state('mainAccountants.bankDataManagement.reportsManagement', {
                url: "/reportsManagement",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/reportsManagement.html?ver=3.80",
                    }
                }
            })
            .state('mainAccountants.poalimAsakim', {
                url: "/poalimAsakim",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'poalimAsakimCtrl',
                        templateUrl: 'views/poalimAsakim.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/poalimAsakimCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.spiderList', {
                url: "/spiderList",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'spiderListCtrl',
                        templateUrl: 'views/spiderList.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/spiderListCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.manageWithdrawals', {
                url: "/manageWithdrawals",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'manageWithdrawalsCtrl',
                        templateUrl: 'views/manageWithdrawals.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/manageWithdrawalsCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.windowsManag', {
                url: "/windowsManag",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'windowsManagCtrl',
                        templateUrl: 'views/windowsManag.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/windowsManagCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.taskManager', {
                url: "/taskManager",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'taskManagerCtrl',
                        templateUrl: 'views/taskManager.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/taskManagerCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('mainAccountants.billing', {
                url: "/billing",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'billingCtrl',
                        templateUrl: 'views/billing.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/billingCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('overviewAcc', {
                url: "/overviewAcc",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        controller: 'overviewAccCtrl',
                        templateUrl: 'views/overviewAcc.html?ver=3.80'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: defaultsCache,
                            files: ['scripts/controllers/overviewAccCtrl.js?ver=3.80']
                        });
                    }]
                }
            })
            .state('overviewAcc.statistics', {
                url: "/",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/overviewAcc.statistics.html?ver=3.80"
                    }
                }
            })
            .state('overviewAcc.ksafim', {
                url: "/ksafim",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/overviewAcc.ksafim.html?ver=3.80"
                    }
                }
            })
            .state('overviewAcc.businessInfo', {
                url: "/businessInfo",
                cache: true,
                data: {pageTitle: 'bizibox'},
                views: {
                    "lazyLoadView": {
                        cache: defaultsCache,
                        templateUrl: "views/overviewAcc.businessInfo.html?ver=3.80"
                    }
                }
            })



        if (!localStorage.getItem('acco_user') && !sessionStorage.getItem('acco_user')) {
            $urlRouterProvider.otherwise('/login');
        } else {
            $urlRouterProvider.otherwise('/promo');
        }

        $compileProvider.debugInfoEnabled(false);
        $httpProvider.defaults.withCredentials = true;
    }

    angular.module('main')
        .config(['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', '$provide', '$compileProvider', '$ocLazyLoadProvider', routes])
        .run(['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams, $templateCache) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                // $rootScope.$on('$viewContentLoaded', function() {
                // 	$templateCache.removeAll();
                // });
            }]);
}());
