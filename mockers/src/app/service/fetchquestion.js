"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetchquestion = exports.QuestionStatus = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var http_1 = require("@angular/common/http");
var QuestionStatus;
(function (QuestionStatus) {
    QuestionStatus["NotVisited"] = "NotVisited";
    QuestionStatus["NotAnswered"] = "NotAnswered";
    QuestionStatus["Answered"] = "Answered";
    QuestionStatus["MarkedForReview"] = "MarkedForReview";
    QuestionStatus["AnsweredAndMarkedForReview"] = "AnsweredAndMarkedForReview";
})(QuestionStatus || (exports.QuestionStatus = QuestionStatus = {}));
// export interface LegendCounts {
//   answered: number;
//   notAnswered: number;
//   notVisited: number;
//   markedForReview: number;
//   answeredAndMarked: number;
//   total: number;
// }
// attemptid - Quizid -- username -- questionId -- selectedOption -- isVisited -- IsMarkedForReview -- IsAnswered -- IsSaved partition key : username,attemptId
var Fetchquestion = function () {
    var _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root',
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var Fetchquestion = _classThis = /** @class */ (function () {
        function Fetchquestion_1(http, oidcSecurityService) {
            this.http = http;
            this.oidcSecurityService = oidcSecurityService;
            this.getQuestionApiUrl = 'https://8dwq1i3uy3.execute-api.ap-south-1.amazonaws.com/dev/getQuestion';
            this.getSnapshotApiUrl = 'https://j5bt4mi9j5.execute-api.ap-south-1.amazonaws.com/dev';
            this.res = null;
            this.questionStateSnapshot = new Map();
            this.attemptId = 'f4fdac68-e519-4a7a-9c08-28f802b4b5fb';
        }
        //  * Fetch a fresh ID Token from Cognito
        Fetchquestion_1.prototype.getApiToken = function () {
            return this.oidcSecurityService.getIdToken().pipe((0, rxjs_1.map)(function (idToken) {
                if (!idToken) {
                    throw new Error('No ID Token available. Please login again.');
                }
                return idToken;
            }));
        };
        Fetchquestion_1.prototype.getQuestionStateSnapshot = function () {
            return this.questionStateSnapshot;
        };
        Fetchquestion_1.prototype.saveQuestionStateSnapshot = function (questionModel, questionId) {
            // Simulate saving question status in a database
            console.log("Saving question state snapshot for question ID:", questionId, "with state:", questionModel);
            this.questionStateSnapshot.set(questionId, questionModel);
            // saveSnapshot(questionId, questionModel);
        };
        // fetchQuestion(questionNumber: number): { questionData: QuestionData; questionModel: QuestionModel } {
        //   //fetch question first 
        //   this.getQuestionFromApi('37a81c5d-6362-41e4-aaf3-9d925579f538', 1).subscribe({
        //     next: (res) => {
        //       console.log('API Status:', res.status);
        //       console.log('Question Data:', res.body);
        //     },
        //     error: (err) => {
        //       console.error('API Error:', err);
        //     }
        //   });
        // //fetch question first by doing the api call
        // //fetch snapshot here if it exists then return that snapshot 
        // // if not present then create new snapshot with default values and return that snapshot
        // //at last save the snapshot by doing the other api call to save the snapshot
        //   // const currQuestionModel = this.getSnapshotFromApi(this.attemptId, questionNumber);
        //   this.getSnapshotFromApi('f4fdac68-e519-4a7a-9c08-28f802b4b5fb', 5).subscribe({
        //     next: (res) => {
        //       console.log('API Status:', res.status);
        //       console.log('Snapshot:', res.body);
        //       if (res.status == 200 && res.body) {
        //       }
        //     },
        //     error: (err) => {
        //       console.error('Error fetching snapshot:', err);
        //     }
        //   });
        //   const cachedQuestion = this.questionStateSnapshot.get(questionNumber);
        //   if (currQuestionModel !== undefined) {
        //     // console.log("Fetching from cache for question number:", questionNumber);
        //     // return {
        //     //   questionData: { "quizId": "37a81c5d-6362-41e4-aaf3-9d925579f538", "id": 3, "question": { "text": "A force of 10 N is applied to move an object 5 m. How much work is done?", "image": "NA" }, "options": [{ "text": "25 J", "image": "NA" }, { "text": "50 J", "image": "NA" }, { "text": "75 J", "image": "NA" }, { "text": "100 J", "image": "NA" }] },
        //     //   questionModel: cachedQuestion
        //     // };
        //   }
        //   else {
        //     console.log("Fetching from api for question number:", questionNumber);
        //     const questionModel: QuestionModel = {
        //       attemptId: "f4fdac68-e519-4a7a-9c08-28f802b4b5fb",
        //       id: questionNumber,
        //       selectedOption: -1,
        //       IsVisited: true,
        //       IsMarkedForReview: false,
        //       IsAnswered: false,
        //       IsSaved: false,
        //     };
        //     this.saveQuestionStateSnapshot(questionModel, questionNumber);
        //     return {
        //       questionData: res.body,
        //       questionModel: questionModel
        //     };
        //   }
        // }
        Fetchquestion_1.prototype.fetchQuestion = function (questionNumber) {
            var _this = this;
            console.log("Fetching from API for question number:", questionNumber);
            // 1. Fetch Question
            return this.getQuestionFromApi('37a81c5d-6362-41e4-aaf3-9d925579f538', questionNumber).pipe((0, rxjs_1.switchMap)(function (questionRes) {
                console.log('Question API Status:', questionRes.status);
                console.log('Question Data:', questionRes.body);
                var questionData = questionRes.body;
                // 2. Fetch Snapshot
                return _this.getSnapshotFromApi('f4fdac68-e519-4a7a-9c08-28f802b4b5fb', questionNumber).pipe((0, rxjs_1.map)(function (snapshotRes) {
                    console.log('Snapshot API Status:', snapshotRes.status);
                    console.log('Snapshot Data:', snapshotRes.body);
                    var questionModel;
                    if (snapshotRes.status === 200 && snapshotRes.body) {
                        // ✅ Use existing snapshot
                        questionModel = snapshotRes.body;
                    }
                    else {
                        // ❌ No snapshot found, create new default
                        questionModel = {
                            attemptId: "f4fdac68-e519-4a7a-9c08-28f802b4b5fb",
                            id: questionNumber,
                            selectedOption: -1,
                            IsVisited: true,
                            IsMarkedForReview: false,
                            IsAnswered: false,
                            IsSaved: false,
                        };
                        // save snapshot locally
                        _this.saveQuestionStateSnapshot(questionModel, questionNumber);
                    }
                    // 3. Return combined result
                    return {
                        questionData: questionData,
                        questionModel: questionModel
                    };
                }));
            }));
        };
        Fetchquestion_1.prototype.getQuestionFromApi = function (quizId, questionId) {
            var _this = this;
            return this.getApiToken().pipe((0, rxjs_1.switchMap)(function (token) {
                var headers = new http_1.HttpHeaders({
                    Authorization: "Bearer ".concat(token)
                });
                return _this.http.get("".concat(_this.getQuestionApiUrl, "?quizId=").concat(quizId, "&questionId=").concat(questionId), {
                    headers: headers,
                    observe: 'response'
                });
            }), (0, rxjs_1.map)(function (response) {
                var _a;
                return {
                    status: response.status,
                    body: (_a = response.body) !== null && _a !== void 0 ? _a : null
                };
            }));
        };
        Fetchquestion_1.prototype.getSnapshotFromApi = function (attemptId, questionId) {
            var _this = this;
            return this.getApiToken().pipe((0, rxjs_1.switchMap)(function (token) {
                var headers = new http_1.HttpHeaders({
                    Authorization: "Bearer ".concat(token)
                });
                return _this.http.get("".concat(_this.getSnapshotApiUrl, "?attemptId=").concat(attemptId, "&questionId=").concat(questionId), {
                    headers: headers,
                    observe: 'response' // ✅ get full HTTP response
                });
            }), (0, rxjs_1.map)(function (response) {
                var _a;
                return {
                    status: response.status,
                    body: (_a = response.body) !== null && _a !== void 0 ? _a : null
                };
            }));
        };
        Fetchquestion_1.prototype.saveQuestionStateSnapshotToDB = function (questionModel, questionNumber) {
            var _this = this;
            return this.getApiToken().pipe((0, rxjs_1.switchMap)(function (token) {
                var headers = new http_1.HttpHeaders({
                    Authorization: "Bearer ".concat(token),
                    'Content-Type': 'application/json'
                });
                // Prepare the payload
                var payload = {
                    attemptId: questionModel.attemptId,
                    questionId: questionNumber,
                    selectedOption: questionModel.selectedOption,
                    IsVisited: questionModel.IsVisited,
                    IsMarkedForReview: questionModel.IsMarkedForReview,
                    IsAnswered: questionModel.IsAnswered,
                    IsSaved: questionModel.IsSaved
                };
                return _this.http.post("".concat(_this.getSnapshotApiUrl), // or /saveSnapshot endpoint
                payload, {
                    headers: headers,
                    observe: 'response' // get full HTTP response
                });
            }), (0, rxjs_1.map)(function (response) {
                var _a;
                return {
                    status: response.status,
                    body: (_a = response.body) !== null && _a !== void 0 ? _a : null
                };
            }));
        };
        return Fetchquestion_1;
    }());
    __setFunctionName(_classThis, "Fetchquestion");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Fetchquestion = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Fetchquestion = _classThis;
}();
exports.Fetchquestion = Fetchquestion;
