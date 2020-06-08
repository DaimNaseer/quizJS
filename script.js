/****************************
 ****** QUIZ CONTROLLER *****
 ****************************/
var quizController=(function(){
//*******Question Constructor**********//
  function Question(id,questionText,options,correctAnswer){
     this.id=id;
     this.questionText=questionText;
     this.options=options;
     this.correctAnswer=correctAnswer;
  }

  var questionLocalStorage={
   setQuestionCollection:function(newCollection){
      localStorage.setItem('questionCollection',JSON.stringify(newCollection));
   },
   getQuestionCollection:function(){
      return JSON.parse(localStorage.getItem('questionCollection'));
   },
   removeQuestionCollection:function(){
      localStorage.removeItem('questionCollection');
      localStorage.setItem('questionCollection','[]');
   }
  };
  if(questionLocalStorage.getQuestionCollection() === null){
   questionLocalStorage.setQuestionCollection([]);
}
var quizProgress={
   index:0
}

//*******Person Constructor**********//
function Person(id,Fname,Lname,score){
   this.id=id;
   this.Fname=Fname;
   this.Lname=Lname;
   this.score=score;
};

var personLocalStorage={
   setPersonCollection:function(newCollection){
      localStorage.setItem('personCollection',JSON.stringify(newCollection));
   },
   getPersonCollection:function(){
      return JSON.parse(localStorage.getItem('personCollection'));
   },
   removePersonCollection:function(){
      localStorage.removeItem('personCollection');
      localStorage.setItem('personCollection','[]')
   }
};
var currPerson={
   fullname: [],
   score:0
};
var adminFullName=['Muhammad','Ahmad'];

if(personLocalStorage.getPersonCollection() === null){
   personLocalStorage.setPersonCollection([]);
}
  return{
     getAdminFullName:adminFullName,
     getCurrPerson:currPerson,
     isFinished:function(){
         return quizProgress.index+1 === questionLocalStorage.getQuestionCollection().length;
     },
     getQuizProgress:quizProgress,
     getQuestionLocalStorage: questionLocalStorage,
     getPersonLocalStorage: personLocalStorage,
   addQuestionsOnLocalStorage:function(newQuestText,opts){
      var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;
      isChecked=false;
      if(questionLocalStorage.getQuestionCollection() === null){
         questionLocalStorage.setQuestionCollection([]);
      }
      optionsArr=[];
      for(var i=0;i<opts.length;i++){
         if(opts[i].value !== ""){
            optionsArr.push(opts[i].value);
         }
         if(opts[i].previousElementSibling.checked && opts[i].value !== ""){
            corrAns=opts[i].value;
            isChecked=true;
         }
      }

      if(questionLocalStorage.getQuestionCollection().length>0){
        questionId= questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length-1].id+1;
      }else{
         questionId=0;
      }
       /*checking conditions and showing alerts*/
      if(newQuestText.value !== ""){
         if(optionsArr.length>1){
            if(isChecked){
      newQuestion=new Question(questionId,newQuestText.value,optionsArr,corrAns);
      getStoredQuests=questionLocalStorage.getQuestionCollection();
      getStoredQuests.push(newQuestion);
      questionLocalStorage.setQuestionCollection(getStoredQuests); 
      
      /*Clearing the text areas and unchecking the checkbox */
      newQuestText.value="";
      for(var j=0;j<opts.length;j++){
         opts[j].value="";
         opts[j].previousElementSibling.checked=false;
      }
      return true;
   }else{
      alert('You missed to check or checked answer without value');
      return false;
   }
   }else{
      alert('Please Insert Atleast 2 options');
      return false;
   }
   }else{
      alert('Please Insert Question');
      return false;
   } 
   },
   addPersonOnLocalStorage:function(){
     var newPerson,personId,getStoredPeople;
     if(personLocalStorage.getPersonCollection().length>0){
      personId=personLocalStorage.getPersonCollection()[personLocalStorage.getPersonCollection().length-1].id+1;
     }else{
        personId=0;
     }
     newPerson=new Person(personId,currPerson.fullname[0],currPerson.fullname[1],currPerson.score);
     getStoredPeople=personLocalStorage.getPersonCollection();
     getStoredPeople.push(newPerson);
     personLocalStorage.setPersonCollection(getStoredPeople);
   },

   checkAns:function(toBeChecked){
       if(toBeChecked === questionLocalStorage.getQuestionCollection()[quizProgress.index].correctAnswer){
         currPerson.score++;
         return true;
       }else{
          return false;
       }
     
   },
};
})();

/****************************
 ****** UI CONTROLLER *******
 ****************************/
var UIController=(function(){
    var domItems={
       //************Admin Section Elements******************** */
      adminPanelContainer:document.querySelector('.admin-panel-container'),
      questInsertBtn:document.querySelector('#question-insert-btn'),
      questText:document.querySelector('#new-question-text'),
      adminOptions:document.querySelectorAll('.admin-option'),
      inputs:document.querySelector('.admin-options-container'),
      questionsInserted:document.querySelector('.inserted-questions-wrapper'),
      questUpdatebtn:document.querySelector('#question-update-btn'),
      questDeletebtn:document.querySelector('#question-delete-btn'),
      questClearbtn:document.querySelector('#questions-clear-btn'),
      resultsListWrapper:document.querySelector('.results-list-wrapper'),
      resultsClearBtn:document.getElementById('results-clear-btn'),
      //************Quiz Section Elements******************** */
      quizContainer:document.querySelector('.quiz-container'),
      askedQuestText:document.getElementById('asked-question-text'),
      quizOptionsWrapper:document.querySelector('.quiz-options-wrapper'),
      progressBar:document.querySelector('progress'),
      instantAnswerContainer:document.querySelector('.instant-answer-container'),
      instantAnswerText:document.getElementById('instant-answer-text'),
      emotion:document.getElementById('emotion'),
      nextQuestBtn:document.getElementById('next-question-btn'),
      //*************Landing page Elements*******************//
      landingPageContainer:document.querySelector('.landing-page-container'),
      startQuizBtn:document.getElementById('start-quiz-btn'),
      firstNameInput:document.getElementById('firstname'),
      lastNameInput:document.getElementById('lastname'),
      //*************result page Elements*******************//
      finalResultContainer:document.querySelector('.final-result-container'),
      finalScoreText:document.getElementById('final-score-text'),

    };
    return{
       getDomItems: domItems,
       addInput:function(){
          var add=function(){
            var adminOptions=document.querySelectorAll('.admin-option');
            var z=adminOptions.length;
        var x='<div class="admin-option-wrapper"><input type="radio" class="admin-option-'+z+'" name="answer" value="'+z+'"><input type="text" class="admin-option admin-option-'+z+'" value=""></div>'
          domItems.inputs.insertAdjacentHTML('beforeend',x);
          domItems.inputs.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus',add);
          domItems.inputs.lastElementChild.lastElementChild.addEventListener('focus',add);
       };
        domItems.inputs.lastElementChild.lastElementChild.addEventListener('focus',add);
      },
      questList:function(getQuests){
         domItems.questionsInserted.innerHTML="";
         var questsArr=getQuests.getQuestionCollection();
         for(var i=0;i<questsArr.length;i++){
         var html='<p><span>'+ (questsArr[i].id+1) +'. '+ questsArr[i].questionText +'</span><button id="question-'+ questsArr[i].id +'">Edit</button></p>';
         domItems.questionsInserted.insertAdjacentHTML('afterbegin',html);
         }
   },
   editQuestList:function(event, storageQuestList, addDynamicalInputs,addDynamicalList){
      var getId,getStorageQuestList,foundItem,placeInArr,optionHTML;
      if('question-'.indexOf(event.target.id)){
         getId=parseInt(event.target.id.split('-')[1]);
         getStorageQuestList=storageQuestList.getQuestionCollection();
         for(var i=0;i<getStorageQuestList.length;i++){
            if(getStorageQuestList[i].id === getId){
               foundItem=getStorageQuestList[i];
               placeInArr=i;
            }
         }
         domItems.questText.value=foundItem.questionText;
         domItems.inputs.innerHTML='';
         for(var x=0;x<foundItem.options.length;x++){
            optionHTML=' <div class="admin-option-wrapper"><input type="radio" class="admin-option-'+x+'" name="answer" value="0"><input type="text" class="admin-option admin-option-'+x+'" value="'+ foundItem.options[x]+'"></div>';
            domItems.inputs.insertAdjacentHTML('beforeend',optionHTML);
         }
         addDynamicalInputs();
         domItems.questUpdatebtn.style.visibility='visible';
         domItems.questDeletebtn.style.visibility='visible';
         domItems.questInsertBtn.style.visibility='hidden';
         domItems.questClearbtn.style.visibility='hidden';
         
         var backToDefault=function(){
            domItems.questText.value='';
            var updatedOptions=document.querySelectorAll('.admin-option');
            for(var j=0;j<updatedOptions.length;j++){
               updatedOptions[j].value='';
               updatedOptions[j].previousElementSibling.checked=false;
            }
            domItems.questUpdatebtn.style.visibility='hidden';
            domItems.questDeletebtn.style.visibility='hidden';
            domItems.questInsertBtn.style.visibility='visible';
            domItems.questClearbtn.style.visibility='visible';
            addDynamicalList(storageQuestList);
         }
         var updateQuest=function(){
            var newOptions,optionsEls,isChecked;
            isChecked=false;
            newOptions=[];
            optionsEls=document.querySelectorAll('.admin-option');
            foundItem.questionText=domItems.questText.value;
            foundItem.corrAns='';
            for(var i=0;i<optionsEls.length;i++){
               if(optionsEls[i].value !== ''){ 
                  newOptions.push(optionsEls[i].value);
                  if(optionsEls[i].previousElementSibling.checked){
                     foundItem.corrAns=optionsEls[i].value;
                     isChecked=true;
                  }
               }
            }
            foundItem.options=newOptions;
            if(foundItem.questionText !== ""){
               if(optionsEls.length>1){
                  if(isChecked){
            getStorageQuestList.splice(placeInArr,1,foundItem);
            storageQuestList.setQuestionCollection(getStorageQuestList);
            backToDefault();
   }else{
      alert('You missed to check or checked answer without value');
   }
   }else{
      alert('Please Insert Atleast 2 options');
   }
   }else{
      alert('Please Insert Question');
   } 
      }
         domItems.questUpdatebtn.onclick=updateQuest;
         var deleteQuest=function(){
            getStorageQuestList.splice(placeInArr,1);
            storageQuestList.setQuestionCollection(getStorageQuestList);
            backToDefault();
        }
         domItems.questDeletebtn.onclick=deleteQuest;
        
      }
   },
    clearQuestionList:function(getStorageQuestList){
       if(getStorageQuestList.getQuestionCollection().length >0){
          var conf=confirm('Are you sure you want to clear list?');
          if(conf){
      getStorageQuestList.removeQuestionCollection();
      domItems.questionsInserted.innerHTML="";
   }
   }else{
      alert('List is already empty..');
   }
   },
   insertQuestToQuiz:function(storedQuestList,progress){
      if(storedQuestList.getQuestionCollection().length !== 0){
        domItems.askedQuestText.textContent=storedQuestList.getQuestionCollection()[progress.index].questionText;
        domItems.quizOptionsWrapper.innerHTML='';
        var characters=['A','B','C','D','E'];
        for(var i=0;i<storedQuestList.getQuestionCollection()[progress.index].options.length;i++){
         domItems.quizOptionsWrapper.innerHTML+='<div class="choice-'+i+'"><span class="choice-'+i+'">'+characters[i]+'</span><p  class="choice-'+i+'">'+storedQuestList.getQuestionCollection()[progress.index].options[i]+'</p></div>'
        }
      }
      },
   displayProgress:function(storedQuestList,progress){
      domItems.progressBar.max = storedQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.index + 1;
      domItems.progressBar.previousElementSibling.textContent=(progress.index + 1) +'/'+(storedQuestList.getQuestionCollection().length);
   },
   newDisplay:function(result){
     domItems.quizOptionsWrapper.style.cssText="opacity:0.5; pointer-events: none;";
     domItems.instantAnswerContainer.style.opacity='1';
     if(result){
      domItems.instantAnswerContainer.lastElementChild.className='green';
      domItems.instantAnswerText.textContent='This is a correct answer';
      domItems.emotion.src='images/happy.png';
     }else {
      domItems.instantAnswerContainer.lastElementChild.className='red';
      domItems.instantAnswerText.textContent='This is a wrong answer';
      domItems.emotion.src='images/sad.png';
   }
   },
   resetDisplay:function(){
      domItems.quizOptionsWrapper.style.cssText="";
     domItems.instantAnswerContainer.style.opacity='0';
   },
   startQuiz:function(currPerson,storageQuestList,admin){
     if(domItems.firstNameInput.value!=='' && domItems.lastNameInput.value !== ''){ 
      if(domItems.firstNameInput.value===admin[0] && domItems.lastNameInput.value === admin[1]){
         domItems.landingPageContainer.style.display='none';
         domItems.adminPanelContainer.style.display='block';
      }else{
         if(storageQuestList.getQuestionCollection().length ===0){
            alert('Your Quiz is not prepared yet');
         }else{
            currPerson.fullname.push(domItems.firstNameInput.value);
            currPerson.fullname.push(domItems.lastNameInput.value);
            domItems.landingPageContainer.style.display='none';
            domItems.quizContainer.style.display='block';
         }
      }
   }else{
      alert('Please Fill in both fields');
   }
   },
   showResultPage:function(currPersonData){
      domItems.finalScoreText.textContent=currPersonData.fullname[0]+' '+currPersonData.fullname[1]+', Your Score Is  '+currPersonData.score;
      domItems.quizContainer.style.display='none';
      domItems.finalResultContainer.style.display='block';
   },
   displayResultToPanel:function(people){
         var htm;
         htm='';
         domItems.resultsListWrapper.innerHTML='';
         for(var i=0;i<people.getPersonCollection().length;i++){
            htm+='<p class="person person-'+i+'"><span class="person-'+i+'">'+people.getPersonCollection()[i].Fname+' '+people.getPersonCollection()[i].Lname+' - '+ people.getPersonCollection()[i].score+' Points</span><button id="delete-result-btn_'+i+'" class="delete-result-btn">Delete</button></p>'
         }
         domItems.resultsListWrapper.innerHTML=htm;

   },
   deleteResult:function(people,event){
      var getStoredPeople,getId;
      getStoredPeople=people.getPersonCollection();
            if(event.target.className==="delete-result-btn"){
               getId=parseInt(event.target.id.substring(18));    
               getStoredPeople.splice(getId,1);
               people.setPersonCollection(getStoredPeople);
            }
         },
         resultsClear:function(people){
               if(people.getPersonCollection().length > 0){
                  var conf=confirm('All the results will be lost.. Are you sure?');
                  if(conf){
                     people.removePersonCollection();
                     people.setPersonCollection([]);
                  }
               }

         }
         }; 
})();

/****************************
 ****** CONTROLLER **********
 ****************************/
var controller=(function(quizCtrl,UICtrl){
   var selectedDomItems=UICtrl.getDomItems;
   UICtrl.addInput();
  UICtrl.questList(quizCtrl.getQuestionLocalStorage); 
   selectedDomItems.questInsertBtn.addEventListener('click',function(){
      var adminOptions=document.querySelectorAll('.admin-option');
   var checkBoolean=quizCtrl.addQuestionsOnLocalStorage(selectedDomItems.questText,adminOptions);
   if(checkBoolean){
      UICtrl.questList(quizCtrl.getQuestionLocalStorage);
   }  
});

  selectedDomItems.questionsInserted.addEventListener('click',function(e){
      UICtrl.editQuestList(e,quizCtrl.getQuestionLocalStorage,UICtrl.addInput,UICtrl.questList);
  });
  selectedDomItems.questClearbtn.addEventListener('click',function(){
   UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
  });

  UICtrl.insertQuestToQuiz(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
  UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);

  selectedDomItems.quizOptionsWrapper.addEventListener('click',function(e){
   var optionsArr=selectedDomItems.quizOptionsWrapper.querySelectorAll('div');
   for(var i=0;i<optionsArr.length;i++){
      if(e.target.className === 'choice-'+i){
         var ans=e.target.textContent.substring(1);
         var x=quizCtrl.checkAns(ans);
         UICtrl.newDisplay(x);
         if(quizCtrl.isFinished()){
            selectedDomItems.nextQuestBtn.textContent='Finish';
         }
        var nextQuestion=function(questData,progress){
               if(quizCtrl.isFinished()){
                  quizCtrl.addPersonOnLocalStorage();
                  UICtrl.showResultPage(quizCtrl.getCurrPerson);
               }else{
                     UICtrl.resetDisplay();
                     quizCtrl.getQuizProgress.index++;
               }
         }
         selectedDomItems.nextQuestBtn.onclick=function(){
      
            nextQuestion(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
            UICtrl.insertQuestToQuiz(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
            UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage,quizCtrl.getQuizProgress);
         }
      }
   }
  });
  selectedDomItems.startQuizBtn.addEventListener('click',function(){
     UICtrl.startQuiz(quizCtrl.getCurrPerson,quizCtrl.getQuestionLocalStorage,quizCtrl.getAdminFullName);  
  });

  selectedDomItems.lastNameInput.addEventListener('focus',function(){
     selectedDomItems.lastNameInput.addEventListener('keypress',function(e){
      if(e.keyCode === 13){
         UICtrl.startQuiz(quizCtrl.getCurrPerson,quizCtrl.getQuestionLocalStorage,quizCtrl.getAdminFullName);
      }
     });
  });
  UICtrl.displayResultToPanel(quizCtrl.getPersonLocalStorage);
  selectedDomItems.resultsListWrapper.addEventListener('click',function(e){
      UICtrl.deleteResult(quizCtrl.getPersonLocalStorage,e);
      UICtrl.displayResultToPanel(quizCtrl.getPersonLocalStorage);
  });
  selectedDomItems.resultsClearBtn.addEventListener('click',function(){
      UICtrl.resultsClear(quizCtrl.getPersonLocalStorage);
      UICtrl.displayResultToPanel(quizCtrl.getPersonLocalStorage);
  });
})(quizController,UIController);