<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<jsp:include page="commonCSS.jsp" flush="true" />

<body>

  <div class="container">
	<div class="row header">
		<div class="span6">
			<h1>
				love Coding <small>generate Java constructed code from class attribute</small>
			</h1>
		</div>
		<div class="span6 right">
			<p>
				developed by <a href="http://jonkeith.com">Fei Feng</a>
			</p>
		</div>
	</div>
	<div class="row">
		<div class="span12">
			<textarea id="inputCode" rows="10" placeholder="Enter your code here..."></textarea>
		</div>
	</div>
    <div class="row">
        <div class="span7">
            <button id="generate" class="btn btn-primary"> Generate</button>
            <button class="btn right" id="show-about" title="how to use ?">?</button>
        </div>
    </div>
    
    
    
    <div id="generated-classes1" class="row" style="display: none;">
		<div class="result-message">
			<a class="close" rel="close" href="#" data-parent-id="generated-classes1">
			<span class="glyphicon glyphicon-remove"></span></a>
			<textarea id="outputCode1" class="output-textarea" rows="10"></textarea>
		</div>
	</div>
	 <div id="generated-classes2" class="row" style="display: none;">
		<div class="result-message">
			<a class="close" rel="close" href="#" data-parent-id="generated-classes2">
			<span class="glyphicon glyphicon-remove"></span></a>
			<textarea id="outputCode2" class="output-textarea" rows="10"></textarea>
		</div>
	</div>
	 <div id="generated-classes3" class="row" style="display: none;">
		<div class="result-message">
			<a class="close" rel="close" href="#" data-parent-id="generated-classes3">
			<span class="glyphicon glyphicon-remove"></span></a>
			<textarea id="outputCode3" class="output-textarea" rows="10"></textarea>
		</div>
	</div>
	<div id="parse-error" class="row" style="display: none;">
		<div class="span12">
			<div class="alert alert-warning">
				<a class="close" rel="close" href="#" data-parent-id="parse-error">
			<span class="glyphicon glyphicon-remove"></span></a>
				<p>
					Parsing your Code didn't work. Please make sure	the format is valid.</p>
				<p>
					Already did that? Please <a href="mailto:china.arq@qq.com">let me know</a> so I
					can fix it.</p>
			</div>
		</div>
	</div>
	<div id="about" class="row" style="display: none;">
		<div class="span12">
			<div class="alert-message block-message">
				<a class="close" rel="close" href="#" data-parent-id="about">
			<span class="glyphicon glyphicon-remove"></span></a>
				<div class="about-section">
					<p class="title"><strong>How</strong><p>
					<p>
						Simple! Copy the following code and paste into the large text area above, 
						then click the <code>Generate</code> button. </p>
					<p>
						&nbsp;</p>
<pre>
private int id;
private int majorId;
private String majorName;
private int centerId;
private String centerName;
private String level;
private String phoneNum;
private String name;
private String password;
private String displayName;
</pre>
					
					<a href="#" class="btn btn-default btn-close" data-parent-id="about">Close</a>
				</div>
			</div>
		</div>
	</div>
	
  </div>

<jsp:include page="commonJS.jsp" flush="true" />

</body>

<script type="text/javascript">
	var $showAboutBtn = $('#show-about');
	var $aboutDiv = $("#about");
	var $parseErrorDiv = $("#parse-error");
	var $closeBtn = $(".close, .btn-close");
	var $inputArea = $('#inputCode');
	var $generateBtn = $('#generate');
	
	var $generatedResult1 = $('#generated-classes1');
	var $outputArea1 = $('#outputCode1');
	var $generatedResult2 = $('#generated-classes2');
	var $outputArea2 = $('#outputCode2');
	var $generatedResult3 = $('#generated-classes3');
	var $outputArea3 = $('#outputCode3');

	var inputText;
	
	$generateBtn.on('click', function(e){
		
		inputText = $inputArea.val();
		var arrayOfLines = inputText.split('\n');
		
		if(!inputText || !arrayOfLines ||arrayOfLines.length == 0){
			showErrorTip();
		}
		
		clearResultView();
		
	    $.each(arrayOfLines, function(index, line) {
	    	//split
	    	var arrayOfTokens = $.trim(line).split(' ');
	    	if(arrayOfTokens.length < 3){
	    		return true;
	    	}
	    	var varPolic = arrayOfTokens[0];
	    	var varType = arrayOfTokens[1];
	    	var varName = arrayOfTokens[2];
	    	
	    	//validate
 	    	if(varPolic.indexOf(';') > -1 || varType.indexOf(';') > -1){
	    		return true;
	    	}
 	    	varName = varName.replace(';', '');
 	    	if(varName.length < 1){
 				return true;
 			}
 	    	
 	    	//refresh view content
 	    	formatResult1(varName);
 	    	formatResult2(varName);
 	    	formatResult3(varType, varName);
	    });
	    if(!$outputArea1.val() || !$outputArea1.val().length){
	    	showErrorTip();
	    }else{
		    showResultView();
	    }
	});
	
	function showErrorTip(){
		hideResultView();
		$parseErrorDiv.slideDown('show');
	}
	
	function hideErrorTip(){
		$parseErrorDiv.slideUp("show");
	}
	
	function clearResultView(){
		$outputArea1.val('');
		$outputArea2.val('');
		$outputArea3.val('');
	}
	
	function showResultView(){
		hideErrorTip();
		$generatedResult1.slideDown("show");
	    $generatedResult2.slideDown("show");
	    $generatedResult3.slideDown("show");
	}
	
	function hideResultView(){
		$generatedResult1.slideUp("show");
	    $generatedResult2.slideUp("show");
	    $generatedResult3.slideUp("show");
	}
	
	function formatResult1(varName){
    	var line = varName + " = srcData.get" + varName[0].toUpperCase() + varName.substr(1) + "();";
    	if($outputArea1.val().length > 0){
		    $outputArea1.val($outputArea1.val() + '\n' + line);
    	}else{
    		$outputArea1.val(line);
    	}
	}
	
	function formatResult2(varName){
		line = "data.set" + varName[0].toUpperCase() + varName.substr(1) + "(" + varName + ");";
		if($outputArea2.val().length > 0){
		    $outputArea2.val($outputArea2.val() + '\n' + line);
    	}else{
    		$outputArea2.val(line);
    	}
	}
	
	function formatResult3(varType, varName){
		var rsMethodName = '';
		var dbVarName = styleHyphenFormat(varName);
	    
		if(varType == 'String' || varType == 'string'){
	    	rsMethodName = "(rs.getString(\"" + dbVarName + "\"));";
	    }else if(varType == 'int' || varType == 'Integer'){
	    	rsMethodName = "(rs.getInt(\"" + dbVarName + "\"));";
	    }else if(varType == 'boolean' || varType == 'Boolean'){
	    	rsMethodName = "(rs.getBoolean(\"" + dbVarName + "\"));";
	    }else if(varType == 'Date' || varType == 'date'){
	    	rsMethodName = "(rs.getTimestamp(\"" + dbVarName + "\"));";
	    }else{
	    	return;
	    }
	    
	    line = "data.set" + varName[0].toUpperCase() + varName.substr(1) + rsMethodName;
	    if($outputArea3.val().length > 0){
		    $outputArea3.val($outputArea3.val() + '\n' + line);
    	}else{
    		$outputArea3.val(line);
    	}
	}
	    
	function styleHyphenFormat(propertyName) {
	  function upperToHyphenLower(match) {
	    return '_' + match.toLowerCase();
	  }
	  return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
	}
	    
	$showAboutBtn.on('click', function(e){
		if(!$aboutDiv.is(":visible")){
			hideResultView();
			hideErrorTip();
		}
		
		$aboutDiv.slideToggle();
	});
	
	$closeBtn.on('click', function(e){
		e.preventDefault();
		
		var parentId = $(this).attr("data-parent-id");
		$('#'+parentId).slideToggle();
	});

</script>

</html>
