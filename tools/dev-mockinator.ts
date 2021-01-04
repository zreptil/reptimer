import * as fs from 'fs';
import * as path from 'path';

const fileList = [];
let importList = {};
// const lng = localStorage.getItem('language') || 'de-DE';
const srcPattern = '../src/app/_models';
const outPath = '../src/app/_models/mock-generator';

createMock();

function createMock(): void {
  const list = fs.readdirSync(getPath(srcPattern));
  const ignore = ['base-data.ts', 'dialog-data.ts'];
  for (const file of list) {
    if (/.*-data\.ts/.test(file)) {
      if (ignore.indexOf(file) < 0) {
        const content = mockFile(file);
        fileList.push(content);
      }
    }
  }

  try {
    fs.mkdirSync(getPath(outPath));
  } catch {
  }

  for (const file of fileList) {
    // file.fileName = file.fileName.replace('-data.ts', '-mock.ts');
    if (file.members.length > 0) {
      const content = createFile(file);
      fs.writeFileSync(getPath(outPath + '/' + file.fileName), content);
    }
  }
}

function createFile(file: any): string {
  let members = '';
  importList = {};
  for (const member of file.members) {
    members += `  ${member.name} = ${createMockType(member)};\n`;
  }
  let ret = `import {MockGen} from '@/_models/mock-generator/mock-gen';\n`;
  ret += `import {BaseMock} from '@/_models/mock-generator/base-mock';\n`;
  Object.keys(importList).forEach(key => {
    const fileName = importList[key];
    ret += `import {${key}} from '@/_models/mock-generator/${fileName}';\n`;
  });

  ret += `\nexport class ${file.className} extends BaseMock {\n`;
  if (file.className === 'FormularMock') {
    const dirs = [{name: '../../Forms/NB_PDF', pattern: /.*\.pdf/},
      {name: '../../Forms/NB_RTF', pattern: /.*\.rtf/}];
    const formList = [];
    for (const dir of dirs) {
      const list = fs.readdirSync(getPath(dir.name));
      for (const formFile of list) {
        if (dir.pattern.test(formFile)) {
          formList.push(`'0${formFile.substring(3, formFile.length - 4)}'`);
        }
      }
    }
    ret += `  static availableForms = [${formList.join(', ')}];\n`;
  }
  ret += `  xmlCfg = {\n    className: '${file.className}'\n  };\n\n`;
  ret += `${members}\n`;
  ret += `  static factory(): ${file.className} {\n`;
  ret += `    return new ${file.className}();\n`;
  ret += `  }\n\n`;
  ret += `  create(): ${file.className} {\n`;
  ret += `    return ${file.className}.factory();\n`;
  ret += `  }\n`;
  ret += '}\n';
  return ret;
}

function createMockType(member: any): string {
  let type = member.type;
  let ret = '';
  const isArray = type.endsWith('[]');
  let method = 'fill';
  if (isArray) {
    type = type.substring(0, type.length - 2);
    method = 'fillArray';
  }
  switch (type) {
    case 'string':
    case 'Date':
    case 'boolean':
    case 'number':
      ret = `MockGen.${method}('${type}', '${member.name}')`;
      break;
    default:
      if (type.endsWith('Data')) {
        type = type.substring(0, type.length - 4) + 'Mock';
        ret = `MockGen.${method}(${type}.factory, '${member.name}')`;
        importList[type] = (type).replace(/([A-Z])/g, ($1) => {
          return '-' + $1.toLowerCase();
        }).replace(/^-/, '');
      } else {
        ret = '?' + type + '?';
      }
      break;
  }
  return ret;
}


function mockFile(file: string): string {
  let className = ('_' + file).replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace(/[-_]/g, '');
  }).replace(/\.ts$/, '');
  const fileName = file.replace(/-data\.ts$/, '-mock.ts');
  let src = fs.readFileSync(getPath(srcPattern + '/' + file)).toString();
  src = src.replace(' ', '');
  const regexp = new RegExp(`export class ${className}`, 'gm');
  let ret: any = src;
  className = className.replace(/Data$/, 'Mock');
  if (regexp.exec(src) != null) {
    ret = src.substring(regexp.lastIndex);
    let idx = ret.lastIndexOf('}');
    ret = ret.substring(0, idx);
    ret = ret.replace(/\/\/.*$/gm, '');
    idx = ret.indexOf('{');
    ret = ret.substring(idx + 1).replace(/[ \t\r\n]/gm, '');
    const members = [];
    const values = ret.split(';');
    for (let value of values) {
      idx = value.indexOf(':');
      const name = value.substring(0, idx);
      value = value.substring(idx + 1);
      idx = value.indexOf('=null');
      if (idx >= 0) {
        const type = value.substring(0, idx);
        const check = name + type;
        if (check.indexOf('(') < 0 && check.indexOf('{') < 0 && name !== '') {
          members.push({name, type});
        }
      }
    }
    ret = {fileName, className, members};
  } else {
    ret = {fileName, className: 'unknown', members: []};
  }

  return ret;
}

function getPath(dir: string, file?: string): string {
  if (dir.startsWith('.') || dir.startsWith('/')) {
    return file ? path.join(__dirname, dir, file) : path.join(__dirname, dir);
  }

  return file ? path.join(dir, file) : dir;
}
