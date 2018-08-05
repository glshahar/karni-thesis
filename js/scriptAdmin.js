'use strict';

var appUrl = "http://localhost:3000/";
// var appUrl = "https://karni-thesis-server.herokuapp.com/";

var app = angular.module('app', ['LocalStorageModule']);

app.controller('appCtrl', function($scope, $http, $timeout, $sce, localStorageService) {
    console.log("Karni - Admin Ctrl");
    $scope.posts = [];
    $scope.noTimes = 0;
    $scope.numOfWords = 0;

    $scope.getNewPosts = function () {
        $http({
            method : "GET",
            url : appUrl+"getPostsInn"
        }).then(function (response) {
            console.log("get all posts Done successfully !");
            // console.log("JSON: "+JSON.stringify(response.data, null, 4));
        }, function (response) {
            console.log("get posts Error !");
        });
    }

    $scope.getAllPosts = function () {
        $scope.loading = true;
        $scope.posts = [];
        $scope.searchKeyword = "";
        $scope.searchInput = "";

        // get all Posts
        $http({
            method : "POST",
            url : appUrl+"getAllPosts"
        }).then(function (response) {
            console.log("get all posts Done successfully !");
            // var tmpArray = [];
            // console.log("JSON: "+JSON.stringify(response.data, null, 4));
            // for (var i = 0; i < response.data.length; i++) {
            //     if(response.data[i].title)
            //         tmpArray.push(response.data[i]);
            //     if(i==response.data.length-1)
            //         $scope.posts = tmpArray;
            // }
            for (var i = 0; i < response.data.length; i++) {
                $scope.numOfWords += response.data[i].title.split(" ").length;
                if(response.data[i].subtitle)
                    $scope.numOfWords += response.data[i].subtitle.split(" ").length;
                $scope.numOfWords += response.data[i].text.split(" ").length;
            }

            $scope.loading = false;
            $scope.posts = response.data;
        }, function (response) {
            console.log("get posts Error !");
        });
    }

    $scope.searchKeywordServer = function () {
        $scope.posts = [];
        $scope.searchKeyword = $scope.searchInput;
        $scope.loading = true;

        $scope.searchKeyword1 = " "+$scope.searchInput+" ";
        $scope.searchKeyword2 = " "+$scope.searchInput+", ";
        $scope.searchKeyword3 = ' '+$scope.searchInput+'" ';
        $scope.searchKeyword4 = ' '+$scope.searchInput+'". ';
        $scope.searchKeyword5 = ' "'+$scope.searchInput+' ';
        $scope.searchKeyword6 = ' '+$scope.searchInput+': ';

        // get Post By Keyword
        $http({
            method : "POST",
            url : appUrl+"getPostByKeyword",
            data: {keyword: $scope.searchKeyword}
        }).then(function (response) {
            $scope.loading = false;
            console.log("get all posts Done successfully !");
            var tmpArray = [];
            console.log("JSON: "+JSON.stringify(response.data, null, 4));
            $scope.posts = response.data;
        }, function (response) {
            console.log("get posts Error !");
            $scope.loading = false;
        });
    }

    $scope.highlight = function(text, search) {
        text = " "+text+" ";
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        else {
            // $scope.searchKeyword1 = " "+search+" ";
            // $scope.searchKeyword2 = " "+search+",";
            // $scope.searchKeyword3 = " "+search+".";
            console.log("{"+$scope.searchKeyword1+"}");
            console.log("{"+$scope.searchKeyword2+"}");
            console.log("{"+$scope.searchKeyword3+"}");
            console.log("{"+$scope.searchKeyword4+"}");
            console.log("{"+$scope.searchKeyword5+"}");
            console.log("{"+$scope.searchKeyword6+"}");
            return $sce.trustAsHtml(text.replace(/\./g, ', ').replace(/\)/g, ', ').replace(/\(/g, ' - ').replace(/\:/g, ' - ')
                                        .replace(new RegExp($scope.searchKeyword1, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword2, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword3, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword4, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword5, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword6, "g"), '<span class="highlightedText">$&</span>'));
        }
    }

    $scope.numberOfTimes = function(){
        $scope.noTimes = document.getElementsByClassName("highlightedText").length;
        return $scope.noTimes;
    }

});
