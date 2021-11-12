angular.module('newsletterGeneratorApp', ['textAngular','ngclipboard'])
    .controller('BlocsController', function($http) {
        var blocController = this;
        this.blocParDefaut = {id:0, title:"", url:"", urlImage:"", content:""};
        this.blocs = [];
        this.urlEnLigne = "";
        this.modalOpened = false;
        this.modalContent = "";
        this.successfull = false;

        this.addNewBloc = function() {
            var bloc = angular.copy(this.blocParDefaut);
            bloc.id = Date.now();
            this.blocs.push(bloc);
        };

        this.removeBloc = function(unId) {
            if(this.blocs.length > 1) {
                var newBlocs = [];
                this.blocs.forEach(function(unBloc) {
                    if(unBloc.id !== unId) {
                        newBlocs.push(unBloc);
                    }
                });
                this.blocs = angular.copy(newBlocs);
            }
        };
        this.generateHTML = function() {
            var headerHtml = "";
            var blocPrincipalHtml = "";
            var blocHtml = "";
            var footerHtml = "";
            var spacerHtml = "";
            $http.get("model/model_head.txt").then(function(response) {
                headerHtml = angular.copy(response.data);
                $http.get("model/model_bloc_principal.txt").then(function(response) {
                    blocPrincipalHtml = angular.copy(response.data);
                    $http.get("model/model_bloc.txt").then(function(response) {
                        blocHtml = angular.copy(response.data);
                        $http.get("model/model_footer.txt").then(function(response) {
                            footerHtml = angular.copy(response.data);
                            $http.get("model/model_spacer.txt").then(function(response) {
                                spacerHtml = angular.copy(response.data);
                                var htmlAGenerer = "";
                                htmlAGenerer += angular.copy(headerHtml).replace("%%URL_VERSION_EN_LIGNE%%",blocController.urlEnLigne);
                                var i = 0;
                                blocController.blocs.forEach(function(unBloc) {
                                    var htmlBlocAInserer = angular.copy(blocHtml);
                                    if(i === 0) {
                                        htmlBlocAInserer = angular.copy(blocPrincipalHtml);
                                    }
                                    htmlAGenerer += htmlBlocAInserer.replace("%%URL_LIEN_IMAGE%%", unBloc.urlImage)
                                        .replace("%%URL%%", unBloc.url)
                                        .replace("%%TITLE%%", unBloc.title)
                                        .replace("%%TITLEIMAGE%%", unBloc.title)
                                        .replace("%%CONTENT%%", unBloc.content);
                                    i++;
                                    if (i !== blocController.blocs.length) {
                                        htmlAGenerer += angular.copy(spacerHtml);
                                    }
                                });
                                htmlAGenerer += angular.copy(footerHtml);
                                blocController.modalContent = angular.copy(htmlAGenerer);
                                blocController.modalOpened = true;
                            });
                        });
                    });
                });
            });
        };
        this.copyToClipboard = function() {
            document.querySelector('#htmlContentToCopy').select();
            blocController.successfull = document.execCommand('copy');
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        };
        this.addNewBloc();
    });

