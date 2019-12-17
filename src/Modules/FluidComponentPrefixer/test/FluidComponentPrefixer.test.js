import FluidComponentPrefixer from "../";
import stringHash from "string-hash";
import {resolveEnvironmentRelativeComponentPath} from "../../PathHelper";

const fs = require('fs');
require('regenerator-runtime/runtime');
jest.mock('fs')

const fixturePath = 'src/Modules/FluidComponentPrefixer/test/fixtures';


describe('buildPrefixedContent', () => {

  it('should return a prefixed scss string', () =>  {

    const fileContent = '// @use-prefix\n' +
        '.test {\n' +
        '    display:none;\n' +
        '}\n'

    const result = '// @use-prefix\n' +
      '.prefix-test {\n' +
      '    display:none;\n' +
      '}\n'

    expect(FluidComponentPrefixer.buildPrefixedContent('prefix-', fileContent)).toBe(result);

  })

});

describe('getPrefixedContent', () => {

  afterEach(() => {
    jest.fn().mockReset();
    jest.fn().mockRestore();
  });

  it('getPrefixedContent rejects because empty array passed...', () => {
    expect.assertions(1);
    const err = new Error('no valid path provided to importer');
    return FluidComponentPrefixer.getPrefixedContent([]).catch(data => expect(data).toEqual(err));
  });

  it('getPrefixedContent resolve array with prefixed data/ non prefixed data', () => {
    expect.assertions(1);

    const fileContentOnce = '// @use-prefix\n' +
        '.testOnce {\n' +
        '    display:none;\n' +
        '}\n';

    const fileContentTwice = '.testTwice {\n' +
        '    display:none;\n' +
        '}\n';

    const result = [
      {
        content: fileContentOnce.replace('testOnce', '1b1m8-testOnce'),
        prefix: "1b1m8-"
      },
      {
        content: fileContentTwice,
        prefix: false
      }
    ]

    fs.readFileSync.mockReturnValueOnce(fileContentOnce);
    fs.readFileSync.mockReturnValueOnce(fileContentTwice);

    return FluidComponentPrefixer.getPrefixedContent(['/component/componentPath/testOnce', '/component/componentPath/testTwice']).then(data => expect(data).toEqual(result));
  });

});

describe('buildPrefix', () => {

  it('it should return a hash value created out of scss file path)', () => {
    const result = 'cj7w1-';

    expect(
      FluidComponentPrefixer.buildPrefix(`${fixturePath}/usePrefixResult.scss`))
      .toBe(result);
  });

});

/*

test('it should return a path to a filename including a scss file extension', () => {
  fs.existsSync.mockReturnValue(true);
  expect(FluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(`${fixturePath}/usePrefixResult.scss`);
});


test('it should return a path to a filename including a scss file widht underscore extension', () => {
  fs.existsSync.mockReturnValueOnce(false);
  fs.existsSync.mockReturnValueOnce(true);
  expect(FluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(`${fixturePath}/_usePrefixResult.scss`);
});

test('it should return false', () => {
  fs.existsSync.mockReturnValueOnce(false);
  fs.existsSync.mockReturnValueOnce(false);
  expect(FluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(false);
});

*/

describe('writePrefixJson', () => {
  const fileName = `${fixturePath}/prefixJson/prefix.json`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  const jsonData = [
    {
      componentPath: resolveEnvironmentRelativeComponentPath(path.dirname(paths[index])),
      prefix: data.prefix
    }
  ]

  it('it should be able to call fs.writeFile', () => {
    fs.existsSync.mockReturnValueOnce(false);
    FluidComponentPrefixer.writePrefixJson(fileName, 'jfwioj')
    expect(fs.writeFile).toHaveBeenCalled();
  })

  it('it should not be able to call fs.writeFile', () => {
    fs.existsSync.mockReturnValueOnce(true);
    FluidComponentPrefixer.writePrefixJson(fileName, 'jfwioj')
    expect(fs.writeFile).toHaveBeenCalledTimes(0)
  })

});




