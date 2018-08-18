'use strict';

// var appUrl = "http://localhost:3000/";
var appUrl = "https://karni-thesis-server.herokuapp.com/";

var app = angular.module('app', ['LocalStorageModule']);

app.controller('appCtrl', function($scope, $http, $timeout, $sce, localStorageService) {
    console.log("Karni - Admin Ctrl");
    $scope.posts = [];
    $scope.noTimes = 0;
    $scope.numOfWords = 0;
    $scope.connected = localStorageService.get('connected') || false; 

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
        $scope.numOfWords = 0;

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
        $scope.searchRandom = false;
        $scope.searchOn = true;
        $scope.posts = [];
        $scope.randPosts = [];
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

    $scope.searchKeywordRandom = function () {
        $scope.searchOn = false;
        $scope.searchRandom = true;
        $scope.posts = [];
        $scope.randPosts = [];
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
            url : appUrl+"getPostByKeyword2",
            data: {keyword: $scope.searchKeyword}
        }).then(function (response) {
            $scope.loading = false;
            console.log("get all posts Done successfully !");
            
            console.log("JSON: "+JSON.stringify(response.data, null, 4));

            var tmpArray = [];
            let tmpPost = "";

            $scope.getRandomNumber = function() {
                let totalResults = tmpArray.length+1;
                console.log("getRandomNumber => from Total: "+totalResults);
                let currNumber = Math.floor(Math.random() * totalResults);
                let realNumber = tmpArray[currNumber].number;
                console.log("RandomBox => "+realNumber);
                console.log("RandomNumber => "+realNumber);
                tmpArray.splice(currNumber, 1);
                return realNumber;
            }

            $scope.getRandomArray = function() {
                var arr = []
                let totalResults = tmpArray.length;
                while(arr.length < 101){
                    var randomnumber = Math.floor(Math.random()*totalResults)+1;
                    if(arr.indexOf(randomnumber) > -1) continue;
                    arr[arr.length] = randomnumber;
                }
                if((arr.length == 101)){
                    console.log("arr: "+JSON.stringify(arr, null, 4));
                    return arr;
                }
            }


            for (var i = 0; i < response.data.length; i++) {
                tmpPost += " "+response.data[i].title+" "+response.data[i].subtitle+" "+response.data[i].text+" EOA";
                // tmpArray.push(response.data[Math.floor(Math.random() * response.data.length+1)]);
                // if(i==149) $scope.posts = tmpArray;
                if(i==response.data.length-1){
                    console.log("KING:::: "+tmpPost);

                    var numberr = tmpPost.split(" ");
                    // alert("1 => "+numberr.length);

                    var tmpPost2 = tmpPost.replace(/\./g, '').replace(/\)/g, '').replace(/\(/g, '').replace(/\:/g, '').replace(/\,/g, '');
                    var numberOfWords = tmpPost2.split($scope.searchKeyword1);

                    var numberr2 = tmpPost2.split(" ");
                    // alert("2 => "+numberr2.length);


                    if(numberOfWords.length>100){
                        let currNumber = 0;
                        let textBefore = "";
                        let textAfter = "";
                        let offsetWords = 0;

                        // prepare tempArray
                        for (var i = 1; i < numberOfWords.length+1; i++) {
                            tmpArray.push({"number":i});
                            if(i==numberOfWords.length){
                                console.log("tmpArray: "+tmpArray);
                                console.log("tmpArray(length): "+tmpArray.length);
                                console.log(JSON.stringify(tmpArray, null, 4));


                                var newArray = $scope.getRandomArray();

                                for (var j = 0; j < newArray.length; j++) {

                                    // get random number between (0 - numberOfWords.length-1)
                                    // currNumber = Math.floor(Math.random() * numberOfWords.length+1);

                                    currNumber = newArray[j];

                                    // let totalResults = tmpArray.length+1;
                                    // currNumber = Math.floor(Math.random() * totalResults);
                                    // tmpArray.splice(currNumber, 1);

                                    // currNumber = $scope.getRandomNumber();
                                    // alert(currNumber);


                                    textBefore = numberOfWords[currNumber-1].split(" ");
                                    offsetWords = 0;
                                    for (var k = 0; k < currNumber-1; k++) {
                                        offsetWords += numberOfWords[k].split(" ").length;
                                        if(k==currNumber-2){
                                            var offset = offsetWords+textBefore.length+currNumber;
                                            let posty = {
                                                "title": j,
                                                "subtitle": currNumber+" / "+numberOfWords.length,
                                                "text": numberr[offset-6]+" "+numberr[offset-5]+" "+numberr[offset-4]+" "+numberr[offset-3]+" "+numberr[offset-2]+" "+numberr[offset-1]+" "+numberr[offset]+" "+numberr[offset+1]+" "+numberr[offset+2]+" "+numberr[offset+3]+" "+numberr[offset+4]+" "+numberr[offset+5]+" "+numberr[offset+6],
                                            }
                                            $scope.randPosts.push(posty);
                                        }
                                    }
         
                                }

                            }
                        }
                    }
                    else {
                        let currNumber = 0;
                        let textBefore = "";
                        let textAfter = "";
                        let offsetWords = 0;
                        // alert(numberOfWords.length);
                        for (var j = 1; j < numberOfWords.length; j++) {
                            textBefore = numberOfWords[j-1].split(" ");
                            offsetWords = 0;
                            if(j-1==0){
                                var offset = 0;
                                // offsetWords = numberOfWords[0].split(" ").length;
                                offset = textBefore.length;
                                let posty = {
                                    "title": j,
                                    // "subtitle": 1+"/"+(numberOfWords.length-1),
                                    "subtitle": "{Not Random - Results less than 100}",
                                    "text": numberr[offset-6]+" "+numberr[offset-5]+" "+numberr[offset-4]+" "+numberr[offset-3]+" "+numberr[offset-2]+" "+numberr[offset-1]+" "+numberr[offset]+" "+numberr[offset+1]+" "+numberr[offset+2]+" "+numberr[offset+3]+" "+numberr[offset+4]+" "+numberr[offset+5]+" "+numberr[offset+6],
                                }
                                $scope.randPosts.push(posty);
                            }
                            else for (var k = 0; k < j-1; k++) {
                                offsetWords += numberOfWords[k].split(" ").length;
                                if(k==j-2){
                                    var offset = offsetWords+textBefore.length+j;
                                    let posty = {
                                        "title": j,
                                        // "subtitle": j+"/"+(numberOfWords.length-1),
                                        "subtitle": "{Not Random - Results less than 100}",
                                        "text": numberr[offset-6]+" "+numberr[offset-5]+" "+numberr[offset-4]+" "+numberr[offset-3]+" "+numberr[offset-2]+" "+numberr[offset-1]+" "+numberr[offset]+" "+numberr[offset+1]+" "+numberr[offset+2]+" "+numberr[offset+3]+" "+numberr[offset+4]+" "+numberr[offset+5]+" "+numberr[offset+6],
                                    }
                                    $scope.randPosts.push(posty);
                                }
                            }
 
                        }
                    }
                }
            }

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
            // console.log("{"+$scope.searchKeyword1+"}");
            // console.log("{"+$scope.searchKeyword2+"}");
            // console.log("{"+$scope.searchKeyword3+"}");
            // console.log("{"+$scope.searchKeyword4+"}");
            // console.log("{"+$scope.searchKeyword5+"}");
            // console.log("{"+$scope.searchKeyword6+"}");
            return $sce.trustAsHtml(text.replace(/\./g, ', ').replace(/\)/g, ', ').replace(/\(/g, ' - ').replace(/\:/g, ' - ')
                                        .replace(new RegExp($scope.searchKeyword1, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword2, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword3, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword4, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword5, "g"), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword6, "g"), '<span class="highlightedText">$&</span>'));
        }
    }

    $scope.highlightOnce = function(text, search) {
        text = " "+text+" ";
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        else {
            // console.log("{"+$scope.searchKeyword1+"}");
            // console.log("{"+$scope.searchKeyword2+"}");
            // console.log("{"+$scope.searchKeyword3+"}");
            // console.log("{"+$scope.searchKeyword4+"}");
            // console.log("{"+$scope.searchKeyword5+"}");
            // console.log("{"+$scope.searchKeyword6+"}");

            if(text.includes($scope.searchKeyword1)){
                return $sce.trustAsHtml(text.replace(/\./g, ', ').replace(/\)/g, ', ').replace(/\(/g, ' - ').replace(/\:/g, ' - ')
                                        .replace(new RegExp($scope.searchKeyword1), '<span class="highlightedText">$&</span>'));
            }
            else if(text.includes($scope.searchKeyword2)){
                return $sce.trustAsHtml(text.replace(/\./g, ', ').replace(/\)/g, ', ').replace(/\(/g, ' - ').replace(/\:/g, ' - ')
                                        .replace(new RegExp($scope.searchKeyword2), '<span class="highlightedText">$&</span>'));
            }
            return $sce.trustAsHtml(text.replace(/\./g, ', ').replace(/\)/g, ', ').replace(/\(/g, ' - ').replace(/\:/g, ' - ')
                                        .replace(new RegExp($scope.searchKeyword3), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword4), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword5), '<span class="highlightedText">$&</span>')
                                        .replace(new RegExp($scope.searchKeyword6), '<span class="highlightedText">$&</span>'));
        }
    }


    $scope.numberOfTimes = function(){
        $scope.noTimes = document.getElementsByClassName("highlightedText").length;
        return $scope.noTimes;
    }


    $scope.adminLogin = function(){
        if($scope.email=="")
            return $scope.errorMsg = "Please Enter Valid Email";
        if($scope.password=="")
            return $scope.errorMsg = "Please Enter Valid Password";

        console.log("Admin User "+$scope.email+" logged in");
        var user = {
            'email': $scope.email,
            'password': $scope.password
        };

        // // Post - Login
        $http({
            url: appUrl+"adminLogin",
            method: "POST",
            data: {user: user},
            headers: {"Content-Type": "application/json"}  
        }).then(function(response) {
            // success
            console.log("POST - Login successfully");
            console.log("response: "+JSON.stringify(response.data, null, 4));
            localStorageService.set('connected', true);
            $scope.connected = true;
            return console.log("Connected successfully");
        }, 
        function(response) { // optional
            // failed
            console.log("Error POST");
            $scope.errorMsg = "Password / Email Incorrect";
        });
    };

    $scope.showPassword = function(){
        var myEl = angular.element( document.querySelector( '#inputPassword' ) );
        myEl.attr('type',"text");
    };

    $scope.logOut = function(){
        console.log("Admin logged out");
        localStorage.clear();
        location.reload();
        console.log("Logout Successfully");
    };



});
