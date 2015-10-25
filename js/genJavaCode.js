
	var $showAboutBtn = $('#show-about');
	var $aboutDiv = $("#about");
	var $parseErrorDiv = $("#parse-error");
	var $closeBtn = $(".close, .btn-close");
	var $inputArea = $('#inputCode');
	var $inputClassName = $('#inputClassName');
	var $createCheckbox = $('#createCheckbox');
	var $updateCheckbox = $('#updateCheckbox');
	var $deleteCheckbox = $('#deleteCheckbox');
	var $getByIdCheckbox = $('#getByIdCheckbox');
	var $getAllCheckbox = $('#getAllCheckbox');
	var $generateBtn = $('#generate');
	
	var $generatedResult = $('#generatedResult');
	var $outputAreaBO = $('#bo textarea');
	var $outputAreaBM = $('#bm textarea');
	var $outputAreaDO = $('#do textarea');
	var $outputAreaDM = $('#dm textarea');

	var inputText;
	var arrayOfLines;
	var className;
	
	$generateBtn.on('click', function(e){
		
		inputText = $inputArea.val();
		arrayOfLines = inputText.split('\n');
		className = $inputClassName.val();

		if(!className){
			showErrorTip();
			$inputClassName.focus();
			return false;
		}else if (!inputText || !arrayOfLines ||arrayOfLines.length == 0){
			showErrorTip();
			$inputArea.focus();
			return false;
		}

		className = className[0].toUpperCase() + className.substr(1)
		
		clearResultView();

		//refresh view content
		formatResultBO();
		formatResultBM();
		formatResultDO();
		formatResultDM();

		showResultView(); 
	});

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
	
	function showErrorTip(){
		hideResultView();
		$parseErrorDiv.slideDown('show');
	}
	
	function hideErrorTip(){
		$parseErrorDiv.slideUp("show");
	}
	
	function clearResultView(){
		$generatedResult.find('textarea').val('');
	}
	
	function showResultView(){
		hideErrorTip();
		$generatedResult.slideDown("show");
	}
	
	function hideResultView(){
		$generatedResult.slideUp("show");
	}
	
	function formatResultBO(){
		var getter = "";
		var setter = "";
		var defaultCons = "public " + className + "() {\n";
    	defaultCons += "}\n\n";
    	defaultCons += "\npublic " + className + "(int id) {\n";
    	defaultCons += "\tsuper(id);\n";
    	defaultCons += "}\n\n";

    	var fromDataConsBegin = "\npublic " + className + "(" + className + "Data srcData) {\n";
    	var fromDataConsBody = "";
    	var fromDataConsEnd = "}\n\n";

    	var toDataConsBegin = "\npublic " + className + "Data toData() {\n";
    	toDataConsBegin += "\t" + className + "Data data = new " + className + "Data();\n";
    	var toDataConsBody = "";
    	var toDataConsEnd = "\treturn data;\n}\n\n";

    	var fromDataList = "\npublic static List<" + className + "> fromSrcDataList(List<" + className + "Data> srcDatas) {\n";
    	fromDataList += "\tif(srcDatas == null) {\n";
    	fromDataList += "\t\treturn null;\n";
    	fromDataList +="\t}\n\n";
    	fromDataList += "\tList<" + className + "> result = new ArrayList<" + className + ">();\n";
		fromDataList += "\tfor(" + className + "Data srcData : srcDatas){\n";
		fromDataList += "\t\tresult.add(new " + className + "(srcData));\n";
		fromDataList +="\t}\n\n";
		fromDataList += "\treturn result;\n}\n\n";
		
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
 	    	
 	    	//getter and setter
 	    	getter += "public " + varType +" get" + varName[0].toUpperCase() + varName.substr(1) + "() {\n";
	    	getter += "\treturn " + varName + ";\n";
	    	getter += "}\n\n";
	    	setter += "public void set" + varName[0].toUpperCase() + varName.substr(1) + "(" + varType + " " + varName + ") {\n";
	    	setter += "\tthis." + varName + " = " + varName + ";\n";
	    	setter += "}\n\n";

	    	//fromData
	    	fromDataConsBody += "\tthis." + varName + " = srcData.get" + varName[0].toUpperCase() + varName.substr(1) + "();\n";

	    	//toData
	    	toDataConsBody += "\tdata.set" + varName[0].toUpperCase() + varName.substr(1) + "(" + varName + ");\n";
	    });

		$outputAreaBO.val(inputText+ '\n\n' + getter + setter + defaultCons + fromDataConsBegin + fromDataConsBody
		 + fromDataConsEnd + toDataConsBegin + toDataConsBody + toDataConsEnd + fromDataList);
	}

	function formatResultDO(){
    	var getter = "";
		var setter = ""; 	
		
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
 	    	
 	    	//getter and setter
 	    	getter += "public " + varType +" get" + varName[0].toUpperCase() + varName.substr(1) + "() {\n";
	    	getter += "\treturn " + varName + ";\n";
	    	getter += "}\n\n";
	    	setter += "public void set" + varName[0].toUpperCase() + varName.substr(1) + "(" + varType + " " + varName + ") {\n";
	    	setter += "\tthis." + varName + " = " + varName + ";\n";
	    	setter += "}\n\n";
	    });

		$outputAreaDO.val(inputText+ '\n\n' + getter + setter);
	}
	
	function formatResultBM(){
		var initVar = "private static Logger logger = LoggerFactory.getLogger(" + className + "Manager.class);\n\n";

    	var defaultCons = "public " + className + "Manager(int schoolId) {\n";
		defaultCons += "\tsuper(schoolId);\n";
		defaultCons += "}\n\n";

		var createMethod =  "public NoneDataResult create(" + className + " data) {\n";
		createMethod += "\tNoneDataResult result = new NoneDataResult();\n";
		createMethod += "\ttry {\n";
		createMethod += "\t\tInteger insertId = DalFactory.instance(getSchoolId()).get" + className + "Dal().create(data.toData());\n";
		createMethod += "\t\tresult.setData(insertId);\n";
		createMethod += "\t} catch (Exception e) {\n";
		createMethod += "\t\tlogger.error(e.getMessage());\n";
		createMethod += "\t\tresult.setHr(HResult.E_DATABASE_INSERT_ERROR);\n";
		createMethod += "\t}\n";
		createMethod += "\treturn result;\n}\n\n";

		var updateMethod = "public NoneDataResult update(" + className + " data) {\n";
		updateMethod += "\tNoneDataResult result = new NoneDataResult();\n";
		updateMethod += "\ttry {\n";
		updateMethod += "\t\tremoveCache(data.getCacheKey());\n";
		updateMethod += "\t\tDalFactory.instance(getSchoolId()).get" + className + "Dal().update(data.toData());\n";
		updateMethod += "\t} catch (Exception e) {\n";
		updateMethod += "\t\tlogger.error(e.getMessage());\n";
		updateMethod += "\t\tresult.setHr(HResult.E_DATABASE_UPDATE_ERROR);\n";
		updateMethod += "\t}\n";
		updateMethod += "\treturn result;\n}\n\n";

		var deleteMethod = "public NoneDataResult delete(int id) {\n";
		deleteMethod += "\tNoneDataResult result = new NoneDataResult();\n";
		deleteMethod += "\ttry {\n";
		deleteMethod += "\t\tremoveCache(new " + className + "(id).getCacheKey());\n";
		deleteMethod += "\t\tDalFactory.instance(getSchoolId()).get" + className + "Dal().delete(id);\n";
		deleteMethod += "\t} catch (Exception e) {\n";
		deleteMethod += "\t\tlogger.error(e.getMessage());\n";
		deleteMethod += "\t\tresult.setHr(HResult.E_DATABASE_DELETE_ERROR);\n";
		deleteMethod += "\t}\n";
		deleteMethod += "\treturn result;}\n\n";

		var getByIdMethod = "public GenericResult<" + className + "> getById(int id) {\n";
		getByIdMethod += "\tGenericResult<" + className + "> result = new GenericResult<" + className + ">(HResult.S_OK, null);\n";
		getByIdMethod += "\t" + className + " data = (" + className + ") getFromCache(new " + className + "(id).getCacheKey());\n";
		getByIdMethod += "\tif (null != data) {\n";
		getByIdMethod += "\t\tresult.setData(data);\n";
		getByIdMethod += "\t\treturn result;\n";
		getByIdMethod += "\t}\n";
		getByIdMethod += "\ttry {\n";
		getByIdMethod += "\t\t" + className + "Data srcData = DalFactory.instance(getSchoolId()).get" + className + "Dal().getById(id);\n";
		getByIdMethod += "\t\tif (null != srcData) {\n";
		getByIdMethod += "\t\t\tdata = new " + className + "(srcData);\n";
		getByIdMethod += "\t\t\tputToCache(data);\n";
		getByIdMethod += "\t\t\tresult.setData(data);\n";
		getByIdMethod += "\t\t}\n";
		getByIdMethod += "\t} catch (Exception e) {\n";
		getByIdMethod += "\t\tlogger.error(e.getMessage());\n";
		getByIdMethod += "\t\tresult.setHr(HResult.E_DATABASE_GET_ERROR);\n";
		getByIdMethod += "\t}\n";
		getByIdMethod += "\treturn result;\n}\n\n";

		var getAllMethod = "public GenericResult<List<" + className + ">> getAll() {\n";
		getAllMethod += "\tGenericResult<List<" + className + ">> result = new GenericResult<List<" + className + ">>(HResult.S_OK, null);\n";
		getAllMethod += "\ttry {\n";
		getAllMethod += "\t\tList<" + className + "Data> srcData = DalFactory.instance(getSchoolId()).get" + className + "Dal().getAll();\n";
		getAllMethod += "\t\tresult.setData(" + className + ".fromSrcDataList(srcData));\n";
		getAllMethod += "\t} catch (Exception e) {\n";
		getAllMethod += "\t\tlogger.error(e.getMessage());\n";
		getAllMethod += "\t\tresult.setHr(HResult.E_UNKNOWN);\n";
		getAllMethod += "\t}\n";
		getAllMethod += "\treturn result;\n}\n\n";

		var content = initVar + defaultCons;
		if($createCheckbox.is(':checked')){
			content += createMethod;
		}
		if($updateCheckbox.is(':checked')){
			content += updateMethod;
		}
		if($deleteCheckbox.is(':checked')){
			content += deleteMethod;
		}
		if($getByIdCheckbox.is(':checked')){
			content += getByIdMethod;
		}
		if($getAllCheckbox.is(':checked')){
			content += getAllMethod;
		}
   		$outputAreaBM.val(content);
	}
	
	function formatResultDM(){

		var defaultCons = "public " + className + "Dal(int schoolId) {\n";
		defaultCons += "\tsuper(schoolId);\n";
		defaultCons += "}\n\n";

		var createMethodBegin =  "public Integer create(" + className + "Data data) {\n";
		createMethodBegin += "\tMap<String, Object> parameters = new HashMap<String, Object>();\n";
		var createMethodBody = "";
		var createMethodEnd = "\treturn (Integer) Execute(\"" + styleDBFormat(className) + "_create\", parameters).get(\"out_id\");\n}\n\n";

		var updateMethodBegin = "public void update(" + className + "Data data) {\n";
		updateMethodBegin += "\tMap<String, Object> parameters = new HashMap<String, Object>();\n";
		var updateMethodBody = "";
		var updateMethodEnd = "\tExecute(\"" + styleDBFormat(className) + "_update\", parameters);\n}\n\n";

		var deleteMethod = "public void delete(int id) {\n";
		deleteMethod += "\tMap<String, Object> parameters = new HashMap<String, Object>();\n";
		deleteMethod += "\tparameters.put(\"in_id\", id);\n";
		deleteMethod += "\tExecute(\"" + styleDBFormat(className) + "_delete\", parameters);\n";
		deleteMethod += "};\n\n";


		var getByIdMethod = "public " + className + "Data  getById(int id) {\n";
		getByIdMethod += "\tMap<String, Object> parameters = new HashMap<String,Object>();\n";
		getByIdMethod += "\tparameters.put(\"in_id\", id);\n";
		getByIdMethod += "\treturn ExecuteReturnObject(\"" + styleDBFormat(className) + "_get_by_id\", parameters, new " + className + "RowMapper());\n";
		getByIdMethod += "};\n\n";

		var getAllMethod = "public List<CourseData> getAll() {\n";
		getAllMethod += "\treturn ExecuteReturnList(\"" + styleDBFormat(className) + "_get_all\", null, new " + className + "RowMapper());\n";
		getAllMethod += "}\n\n";

		var dataMapperBegin = "\nclass " + className + "RowMapper implements RowMapper<" + className + "Data> {\n"
		dataMapperBegin += "\t@Override\n";
		dataMapperBegin += "\tpublic " + className + "Data mapRow(ResultSet rs, int rowNum) throws SQLException {\n"
		dataMapperBegin += "\t\t" + className + "Data data = new " + className + "Data();\n";
    	var dataMapperBody = "";
    	var dataMapperEnd = "\t\treturn data;\n\t}\n}\n\n";

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
 	    	
 	    	if (varName !== 'id' && varName !== 'Id') {
 	    		createMethodBody += "\tparameters.put(\"in_" + styleHyphenFormat(varName) + ", data.get" + varName[0].toUpperCase() + varName.substr(1) + "());\n";
 	    	};

 	    	updateMethodBody += "\tparameters.put(\"in_" + styleHyphenFormat(varName) + ", data.get" + varName[0].toUpperCase() + varName.substr(1) + "());\n";

 	    	var rsMethodName = "";
 	    	var dbVarName = styleHyphenFormat(varName);
			if(varType == 'String' || varType == 'string'){
		    	rsMethodName = "(rs.getString(\"" + dbVarName + "\"))";
		    }else if(varType == 'int' || varType == 'Integer'){
		    	rsMethodName = "(rs.getInt(\"" + dbVarName + "\"))";
		    }else if(varType == 'boolean' || varType == 'Boolean'){
		    	rsMethodName = "(rs.getBoolean(\"" + dbVarName + "\"))";
		    }else if(varType == 'Date' || varType == 'date'){
		    	rsMethodName = "(rs.getTimestamp(\"" + dbVarName + "\"))";
		    }
		    
		    dataMapperBody += "\t\tdata.set" + varName[0].toUpperCase() + varName.substr(1) + rsMethodName + ";\n";
	    });

		var content = defaultCons;
		if($createCheckbox.is(':checked')){
			content += createMethodBegin + createMethodBody + createMethodEnd;
		}
		if($updateCheckbox.is(':checked')){
			content += updateMethodBegin + updateMethodBody + updateMethodEnd;
		}
		if($deleteCheckbox.is(':checked')){
			content += deleteMethod;
		}
		if($getByIdCheckbox.is(':checked')){
			content += getByIdMethod;
		}
		if($getAllCheckbox.is(':checked')){
			content += getAllMethod;
		}

		content += dataMapperBegin + dataMapperBody + dataMapperEnd;
   		$outputAreaDM.val(content);
	}
	    
	function styleHyphenFormat(propertyName) {
	  function upperToHyphenLower(match) {
	    return '_' + match.toLowerCase();
	  }
	  return propertyName.replace(/[A-Z]/g, upperToHyphenLower);
	}

	function styleDBFormat(propertyName) {
		var str = propertyName[0].toLowerCase() + propertyName.substr(1);
	  function upperToHyphenLower(match) {
	    return '_' + match.toLowerCase();
	  }
	  return str.replace(/[A-Z]/g, upperToHyphenLower);
	} 
