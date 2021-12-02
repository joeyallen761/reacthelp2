from flask import render_template
from flask import request
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route("/remove_comments", methods=['POST'])
def remove_comments_flask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(remove_comments(rawCode))

@app.route('/hasOutdatedExport', methods=['POST'])
def hasOutdatedExportFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    #baseLevelCode = getBaseLevelCode(rawCode) # only check baselevel code for bad export?
    return jsonify_response('ReactDOM.render(' in rawCode)

@app.route('/replaceOutdatedExport', methods=['POST'])
def replaceOutdatedExportFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    print(rawCode)
    return jsonify_response(replaceOutdatedExport(rawCode))

@app.route('/getIsClass', methods=['POST'])
def getIsClassFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(getIsClass(rawCode))

@app.route('/getIsFunctional', methods=['POST'])
def getIsFunctionalFlask():
    jsonData = request.get_json(force=True)
    #print('isclass',jsonData)
    rawCode = jsonData['text']
    #print(rawCode)
    #print(getIsFunctional(rawCode))
    return jsonify_response(getIsFunctional(rawCode))

@app.route('/getDeclarationFull',methods=['POST'])
def getDeclarationFullFlask():
    jsonData = request.get_json(force=True)
    print('getdecfull',jsonData)
    rawCode = jsonData['text']
    return jsonify_response(getDeclarationFull(rawCode))

@app.route('/canBeConvertedToClass',methods=['POST'])
def canBeConvertedToClassFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(canBeConvertedToClass(rawCode))

@app.route('/canBeConvertedToFunction',methods=['POST'])
def canBeConvertedToFunctionFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(canBeConvertedToFunction(rawCode))

@app.route('/functionalToClass',methods=['POST'])
def functional_to_classFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(functional_to_class(rawCode))

@app.route('/classToFunctional',methods=['POST'])
def class_to_functionalFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(class_to_functional(rawCode))

@app.route('/getOutdatedExport', methods=["POST"])
def getOutdatedExportFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(getOutdatedExport(rawCode))

@app.route('/addState', methods=["POST"])
def addStateFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(addState(rawCode))

@app.route('/getFirstComponentName',methods=["POST"])
def getFirstComponentNameFlask():
    jsonData = request.get_json(force=True)
    rawCode = jsonData['text']
    return jsonify_response(getFirstComponentName(rawCode))

def jsonify_response(o):
    return {'response':o}

def remove_comments(string):
    import re
    pattern = r"(\".*?\"|\'.*?\')|(/\*.*?\*/|//[^\r\n]*$)"
    # first group captures quoted strings (double or single)
    # second group captures comments (//single-line or /* multi-line */)
    regex = re.compile(pattern, re.MULTILINE|re.DOTALL)
    def _replacer(match):
        # if the 2nd group (capturing comments) is not None,
        # it means we have captured a non-quoted (real) comment string.
        if match.group(2) is not None:
            return "" # so we will return empty to remove the comment
        else: # otherwise, we will return the 1st group
            return match.group(1) # captured quoted-string
    return regex.sub(_replacer, string)

def get_inner_code(object_declaration, code):
    key = object_declaration
    i = code.find(key)
    bracketCount = 0
    inBracket = False
    innerCode = ""
    while i < len(code) and (bracketCount > 0 or not inBracket):
        char = code[i]
        if char == '{':
            bracketCount += 1
            if not inBracket:
                inBracket = True
        elif char == '}':
            bracketCount -= 1
        if inBracket:
            innerCode += char
        i += 1
    return innerCode

def getBaseLevelCode(rawCode):
    bracketCount = 0
    baseLevelCode = ""
    for char in rawCode:
        if bracketCount == 0:
            baseLevelCode += char
        if char == "{":
            bracketCount += 1
        elif char == "}":
            bracketCount -= 1
    return baseLevelCode

def indexInBaseLevelCode(index, rawCode):
    bracketCount = 0
    currIndex = 0
    while currIndex < index:
        char = rawCode[currIndex]
        if char == "{":
            bracketCount += 1
        elif char == "}":
            bracketCount -= 1
        currIndex += 1
    return bracketCount == 0

def hasValidExport(rawCode):
    baseLevelCode = getBaseLevelCode(rawCode)
    return rawCode.find("export default") > 0#fix to use baseLevelCode

def getFirstExport(rawCode):
    baseLevelCode = getBaseLevelCode(rawCode)
    if baseLevelCode.find("export default") > 0:
        i = baseLevelCode.find("export default") + len("export default")
        wordCount = 0
        textCount = 0
        while i < len(baseLevelCode) and wordCount<1:
            if baseLevelCode[i].isspace():
                if textCount > 0:
                    wordCount += 1
            else:
                textCount += 1
            i += 1
        exported_word = baseLevelCode[baseLevelCode.find("export default") + len("export default "):i-1].split(';')[0]
        return exported_word

def findDeclaration(objectName, rawCode):
    baseLevelCode = getBaseLevelCode(rawCode.replace(";","\n"))
    #print(baseLevelCode)
    exported_word_declaration = ""
    while baseLevelCode.find(objectName) > 0: #while
        i = baseLevelCode.find(objectName)
        if baseLevelCode[i-1].isspace():
            if baseLevelCode[i+len(objectName)].isspace() or baseLevelCode[i+len(objectName)] == '(':
                #we have found valid declaration.
                wordCount = 0
                textCount = 0
                while i > 0 and (wordCount == 0 or baseLevelCode[i] != '\n'):
                    i -= 1
                    if baseLevelCode[i].isspace():
                        if textCount > 0:
                            wordCount += 1
                            break
                    else:
                        textCount += 1
                startDeclaration = i
                while i < len(baseLevelCode) and baseLevelCode[i] != '{':
                    i+= 1
                endDeclaration = i
                exported_word_declaration = baseLevelCode[startDeclaration:endDeclaration]
                #inner_code = get_inner_code(exported_word_declaration, rawCode)
                # get inner code.
                break
            else:
                print("2nd if fails")
        else:
            print('1st if fails',baseLevelCode[i-1])
        baseLevelCode = baseLevelCode.replace(objectName, " "+objectName[1:],1) # no way exported_word can have space in it
        i -= 1
    clean_exported_word_declaration = ' '.join(exported_word_declaration.split())
    return clean_exported_word_declaration

def getDeclarationFull(rawCode):
    if hasOutdatedExport(rawCode):
        print('outdated export in '+rawCode)
        return False
    if not hasValidExport(rawCode):
        print('no valid export in '+rawCode)
        return False
    object_exported_name = getFirstExport(rawCode)
    declaration = findDeclaration(object_exported_name, rawCode)
    return declaration

def getIsClass(rawCode):
    if hasOutdatedExport(rawCode) or not hasValidExport(rawCode):
        return False
    object_exported_name = getFirstExport(rawCode)
    declaration = findDeclaration(object_exported_name, rawCode)
    print("declaration",declaration)
    return "class" in declaration#declaration.startswith('class')

def getIsFunctional(rawCode):
    if hasOutdatedExport(rawCode) or not hasValidExport(rawCode):
        return False
    object_exported_name = getFirstExport(rawCode)
    declaration = findDeclaration(object_exported_name, rawCode)
    return "function" in declaration#declaration.startswith('function')

def hasOutdatedExport(rawCode):
    #baseLevelCode = getBaseLevelCode(rawCode) # only check baselevel code for bad export?
    return 'ReactDOM.render(' in rawCode

def getOutdatedExportTarget(outdated_export):
    # get name between '<' and '/>' tags
    split1 = outdated_export.split('<')[1]
    target = split1.split('/>')[0].strip()
    return target

def replaceOutdatedExport(rawCode):
    start_i = rawCode.find('ReactDOM.render(')
    i = start_i+len('ReactDOM.render(')
    parenth_count = 1
    while i < len(rawCode) and parenth_count > 0:
        if rawCode[i] == '(':
            parenth_count += 1
        elif rawCode[i] == ')':
            parenth_count -= 1
        i += 1
    outdated_export_statement = rawCode[start_i:i]
    export_target = getOutdatedExportTarget(outdated_export_statement)
    new_export_statement = 'export default '+export_target+';\n'
    rawCode = rawCode.replace(outdated_export_statement, new_export_statement)
    return rawCode

def getOutdatedExport(rawCode):
    if hasOutdatedExport(rawCode):
        start_i = rawCode.find('ReactDOM.render(')
        i = start_i+len('ReactDOM.render(')
        parenth_count = 1
        while i < len(rawCode) and parenth_count > 0:
            if rawCode[i] == '(':
                parenth_count += 1
            elif rawCode[i] == ')':
                parenth_count -= 1
            i += 1
        outdated_export_statement = rawCode[start_i:i]
        return outdated_export_statement
    else:
        return "zkldjfklsjadfljJALKFSJLKASF21FAJKLAFJKLSA453456"

def getDeclarationBeginIndex(objectName, rawCode):
    #declaration = findDeclaration(objectName, rawCode)
    #return rawCode.find(declaration)
    rawCode = rawCode.replace(";","\n")
    while rawCode.find(objectName) > 0: #while
        i = rawCode.find(objectName)
        if rawCode[i-1].isspace():
            if rawCode[i+len(objectName)].isspace() or rawCode[i+len(objectName)] == '(': # ensures word is not in another word
                #we have found valid declaration.
                wordCount = 0
                textCount = 0
                while i > 0 and (wordCount == 0 or rawCode[i] != '\n'):
                    i -= 1
                    if rawCode[i].isspace():
                        if textCount > 0:
                            wordCount += 1
                            break
                    else:
                        textCount += 1
                startDeclaration = i
                return startDeclaration + 1
        rawCode = rawCode.replace(objectName, " "+objectName[1:],1)

def get_end_index(objectName, rawCode):
    start_index = getDeclarationBeginIndex(objectName, rawCode)
    bracket_count = 0
    isInitiated = False
    i = start_index
    while i < len(rawCode) and (bracket_count > 0 or not isInitiated):
        if rawCode[i] == '{':
            bracket_count += 1
            if not isInitiated:
                isInitiated = True
        elif rawCode[i] == '}':
            bracket_count -= 1
        i += 1
    return i

def getAllObjectCode(objectName, rawCode):
    start_index = getDeclarationBeginIndex(objectName, rawCode)
    end_index = get_end_index(objectName, rawCode)
    return rawCode[start_index:end_index]

    #getAllObjectCode(function_name, rawCode)
def canBeConvertedToClass(rawCode):
    canBeConverted = True
    object_exported_name = getFirstExport(rawCode)
    object_declaration = findDeclaration(object_exported_name, rawCode)
    args_string = get_args(object_exported_name, object_declaration)
    if not (args_string.isspace() or len(args_string)==0):
        canBeConverted = False
        print('Function has parameters ('+args_string+') which cannot be converted into class code.')
    return canBeConverted

def canBeConvertedToFunction(rawCode):
    print('class has constructor', classHasConstructor(rawCode))
    print('hasStateDefined', hasStateDefined(rawCode))
    return not (classHasConstructor(rawCode) or hasStateDefined(rawCode))

def get_args(objectName, declaration):
    after_name = declaration.split(objectName)[1]
    parenth_count = 0
    args_string = ""
    for i in range(len(after_name)):
        if after_name[i] == '(':
            parenth_count += 1
            if parenth_count > 1:
                args_string += after_name[i]
        elif after_name[i] == ')':
            parenth_count -= 1
            if parenth_count == 0:
                break
            else:
                args_string += after_name[i]
        elif parenth_count > 0:
            args_string += after_name[i]
    return args_string

def findReturnInFunction(inner_code):
    i = inner_code.find('return')
    while inner_code.find('return') != -1:
        i = inner_code.find('return')
        if inner_code[i-1].isspace() and (inner_code[i+len('return')].isspace() or inner_code[i+len('return')] == '('): #' return ' is by itself
            if indexInBaseLevelCode(i, inner_code):
                return i
        inner_code = inner_code.replace('return','RETURN',1) # ensure we next look at next return
    if i == -1:
        print('findReturnInFunction i == -1')
    return i

def findReturnEndInFunction(inner_code):
    i = findReturnInFunction(inner_code) + len('return')
    parenth_count = 0
    isInitiated = False
    nonSpaceCharHasBeenSeen = False
    while i < len(inner_code) and (parenth_count>0 or not isInitiated):
        char = inner_code[i]
        if char ==';' and not isInitiated:
            return i
        elif char in [';','\n'] and not isInitiated and nonSpaceCharHasBeenSeen:
            return i
        elif char == '(':
            parenth_count += 1
            if not isInitiated:
                isInitiated = True
        elif char == ')':
            parenth_count -= 1
        i+=1
        if not char.isspace():
            isInitiated = True
    return i

def findRenderInClass(inner_code):
    i = inner_code.find('return')
    while inner_code.find('render') != -1:
        i = inner_code.find('render')
        if inner_code[i-1].isspace() and (inner_code[i+len('render')].isspace() or inner_code[i+len('return')] == '('): #' return ' is by itself
            if indexInBaseLevelCode(i, inner_code):
                return i
        inner_code = inner_code.replace('render','RENDER',1) # ensure we next look at next return
    if i == -1:
        print('findRenderInClass i == -1')
    return i

def findRenderEndInClass(inner_code):
    i = findRenderInClass(inner_code) + len('render')
    bracket_count = 0
    isInitiated = False
    while i < len(inner_code) and (bracket_count>0 or not isInitiated):
        char = inner_code[i]
        if char == '{':
            bracket_count += 1
            if not isInitiated:
                isInitiated = True
        elif char == '}':
            bracket_count -= 1
        i+=1
    return i

def getRenderInnerCode(inner_code):
    i = findRenderInClass(inner_code) + len('render')
    bracket_count = 0
    isInitiated = False
    inner_string = ""
    while i < len(inner_code) and (bracket_count>0 or not isInitiated):
        char = inner_code[i]
        if char == '{':
            bracket_count += 1
            if not isInitiated:
                isInitiated = True
                i+=1
                continue
        elif char == '}':
            bracket_count -= 1
        i+=1
        if isInitiated and bracket_count > 0:
            inner_string += char
    return inner_string

def findConstructorInClass(inner_code):
    i = inner_code.find('constructor')
    while inner_code.find('constructor') != -1:
        i = inner_code.find('constructor')
        if inner_code[i-1].isspace() and (inner_code[i+len('constructor')].isspace() or inner_code[i+len('constructor')] == '('): #' return ' is by itself
            if indexInBaseLevelCode(i, inner_code):
                return i
        inner_code = inner_code.replace('constructor','constructor',1) # ensure we next look at next return
    if i == -1:
        print('findRenderInClass i == -1')
    return i

def findConstructorEndInClass(inner_code):
    i = findConstructorInClass(inner_code) + len('constructor')
    bracket_count = 0
    isInitiated = False
    while i < len(inner_code) and (bracket_count>0 or not isInitiated):
        char = inner_code[i]
        if char == '{':
            bracket_count += 1
            if not isInitiated:
                isInitiated = True
        elif char == '}':
            bracket_count -= 1
        i+=1
    return i

def split_inner_functional_code(inner_code):
    return_begin = findReturnInFunction(inner_code)
    return_end = findReturnEndInFunction(inner_code)
    support_code = inner_code[:return_begin] + inner_code[return_end:]
    to_return = inner_code[return_begin:return_end]
    return support_code[1:-1], to_return #trim first and last brackets off support code

def split_inner_class_code(inner_code):
    render_begin = findRenderInClass(inner_code)
    print('begin render',render_begin)
    render_end = findRenderEndInClass(inner_code)
    print('end render',render_end)
    raw_support_code = inner_code[:render_begin] + inner_code[render_end:]
    support_code = clipBrackets(raw_support_code)
    render_code = getRenderInnerCode(inner_code)
    #print(inner_code[render_begin:render_end]) # looks good
    return support_code, render_code

def clipBrackets(codeString):
    open_brack_locations = []
    close_brack_locations = []
    for i in range(len(codeString)):
        if codeString[i] == '{':
            open_brack_locations.append(i)
        elif codeString[i] == '}':
            close_brack_locations.append(i)
    newString = ""
    for i in range(len(codeString)):
        if i == open_brack_locations[0] or i == close_brack_locations[-1]:
            continue
        else:
            newString += codeString[i]
    return newString

def functional_to_class(rawCode):
    function_name = getFirstExport(rawCode)
    declaration = findDeclaration(function_name, rawCode)
    inner_code = get_inner_code(declaration, rawCode)
    func_params = get_args(function_name, declaration)#.split(',')#to split args up
    support_code, to_return = split_inner_functional_code(inner_code)
    print("functional_to_class","\n\n\nsupport_code", support_code, "\n\n\nto_return", to_return, "\n\n\nfunction_name", function_name, "\n\n\ndeclaration", declaration, "\n\n\ninner_code", inner_code,"\n\n\nfunc_params", func_params)

    class_code = 'class '+function_name+' extends React.Component{\n' + 'constructor(props) {\n \
        super(props);\n}'+support_code +'\n' + \
        'render() {\n' + to_return + '\n}\n}'

    rawCode = rawCode.replace(getAllObjectCode(function_name, rawCode), class_code) #surgically replace old code

    if "import React from 'react'" not in rawCode:
        rawCode = "import React from 'react';\n" + rawCode

    return rawCode

def class_to_functional(rawCode):
    class_name = getFirstExport(rawCode)
    declaration = findDeclaration(class_name, rawCode)
    inner_code = get_inner_code(declaration,rawCode)
    support_code, render_code = split_inner_class_code(inner_code)
    functional_code = 'function '+class_name+'(){\n' + support_code +'\n' + render_code +'\n}'
    return rawCode.replace(getAllObjectCode(class_name,rawCode), functional_code)

def classHasConstructor(rawCode):
    class_name = getFirstExport(rawCode)
    declaration = findDeclaration(class_name, rawCode)
    inner_code = get_inner_code(declaration,rawCode)
    inner_code_clean = clipBrackets(inner_code)
    constructor_ind = findConstructorInClass(inner_code_clean)
    print(rawCode, "constructorind",constructor_ind)
    return constructor_ind > -1

def getClassConstructor(rawCode):
    class_name = getFirstExport(rawCode)
    declaration = findDeclaration(class_name, rawCode)
    inner_code = get_inner_code(declaration,rawCode)
    inner_code_clean = clipBrackets(inner_code)
    constructor_ind = findConstructorInClass(inner_code_clean)
    constructor_end = findConstructorEndInClass(inner_code_clean)
    constructor_stmt = inner_code_clean[constructor_ind:constructor_end]
    return constructor_stmt

def classStateInConstructor(rawCode):
    constructor_stmt = getClassConstructor(rawCode).replace(';','\n')
    for line in constructor_stmt.split('\n'):
        if line.strip().startswith('this.state'):
            return True
    return False

def classStateInTopLevel(rawCode):
    class_name = getFirstExport(rawCode)
    declaration = findDeclaration(class_name, rawCode)
    inner_code = get_inner_code(declaration,rawCode)
    inner_code_clean = clipBrackets(inner_code)
    baseLevelCode = getBaseLevelCode(inner_code_clean).replace(';','\n')
    for line in baseLevelCode.split('\n'):
        s_line = line.strip()
        if s_line.startswith('state'):
            if s_line[len('state')].isspace() or s_line[len('state')] == '=':
                return True
    return False

def getFirstBracketIndices(codeString):
    bracketCount = 0
    isInitialized = False
    begin_i = 0
    end_i = 0
    i = 0
    while i < len(codeString) and (bracketCount > 0 or not isInitialized):
        if codeString[i] == '{':
            bracketCount += 1
            if not isInitialized:
                begin_i = i
                isInitialized = True
        elif codeString[i] == '}':
            bracketCount -= 1
            if bracketCount == 0:
                end_i = i+1
        i += 1
    return begin_i, end_i

def hasStateDefined(rawCode):
    return classStateInConstructor(rawCode) or classStateInTopLevel(rawCode)

def getStateDefinition(rawCode):
    class_name = getFirstExport(rawCode)
    declaration = findDeclaration(class_name, rawCode)
    inner_code = get_inner_code(declaration,rawCode)
    inner_code_clean = clipBrackets(inner_code)
    constructor_ind = findConstructorInClass(inner_code_clean)
    baseLevelCode = getBaseLevelCode(inner_code_clean)
    #if in constructor, this.state = is defined
    #if in main code, state = is defined

    return baseLevelCode, inner_code_clean

def getStateDefFromConstructor(constructor_stmt):
    #constructor_stmt = constructor_stmt.replace('\n',';')
    start_i = constructor_stmt.find('this.state') + len('this.state')
    startingPoint = constructor_stmt[start_i:]
    stateStart, stateEnd = getFirstBracketIndices(startingPoint)
    return startingPoint[stateStart:stateEnd]

def addComponentToStateDef(rawCode, c):
    d = getStateDefFromConstructor(getClassConstructor(rawCode))
    newString = "{"
    data = clipBrackets(d)
    for item in data.split(','):
        key, val = item.split(':')
        key = key.strip()
        val = val.strip()
        newString+= key+': '+val+', '
    newString += c+': '+"\'\'}"
    return rawCode.replace(d, newString)

def addState(rawCode):
    i = rawCode.find("super(props);") + len("super(props);")
    return rawCode[:i]+"\nthis.state = {exampleString: 'hi', exampleInt: 5}"+rawCode[i:]

def getFirstComponentName(rawCode):
    for line in rawCode.split("\n"):
        if line.startswith("class") or line.startswith("function"):
            return line.split()[1].split('(')[0]
    return "App"
'''
def getVariables(rawCode):
    #for each var, does it have a "." in it? If so, split by dots starting from beginning and check if defined

    reserved_words = ['abstract', 'else', 'instanceof',  'super','boolean','enum','int','switch','break','export'\
        ,'interface', 'synchronized','byte','extends','let','this','case','false','long','throw','catch','final'\
        ,'native','throws','char','finally','new','transient','class','float','null','true','const','for'\
        ,'package','try','continue','function','private','typeof','debugger','goto','protected','var'\
        ,'default','if','public','void','delete','implements','return','volatile','do','import'\
        ,'short','while','double','in','static','with']
    variable_names = []

    rawCode = rawCode.replace(";","\n")
    for line in rawCode.split('\n'):
        words = line.split()
        for i in range(len(words)):
            word = words[i]
            if any(x in word for x in ['(',')','[',']']):
                break
            if '(' in word:
                break
            if '(' in word:
                break
            if '[' in word:
                break
            if ']' in word:
                break

            if word not in reserved_words:
                equalsNext = False
                if i != 2:
                    continue
'''
