import fluidComponentPrefixer from "../";
import stringHash from "string-hash";
import {parse, stringify} from 'sast';

const fs = require('fs');
require('regenerator-runtime/runtime');
jest.mock('fs')

const fileContent = '// @use-prefix\n' +
  '.test {\n' +
  '    display:none;\n' +
  '}\n'


const fixturePath = 'src/Modules/FluidComponentPrefixer/test/fixtures';

test('it should return a prefixed scss string', () =>  {

  const fixture = '// @use-prefix\n' +
    '.prefix-test {\n' +
    '    display:none;\n' +
    '}\n'

  expect(fluidComponentPrefixer.buildPrefixedContent('prefix-', fileContent)).toBe(fixture);

})

describe('getPrefixedContent', () => {

  afterEach(() => {
    jest.fn().mockReset();
    jest.fn().mockRestore();
  });

  it('it should return false', () => {
    expect(
      fluidComponentPrefixer.getPrefixedContent(`${fixturePath}/withoutPrefix/withoutPrefix.scss`, 'rthrth-', false))
      .toBe(false);
  })

  it('it should return a prefixed scss string', () => {

    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(fileContent);

    const fixture = '// @use-prefix\n' +
      '.162op-test {\n' +
      '    display:none;\n' +
      '}\n'

    expect(
      fluidComponentPrefixer.getPrefixedContent(`${fixturePath}/withoutPrefix/withoutPrefix.scss`, 'rthrth-', true))
      .toBe(fixture);
  })


  /*
  it('it should return false', () => {
    const mock = jest.spyOn(fluidComponentPrefixer, 'resolveFilePath');  // spy on otherFn
    mock.mockReturnValue(false);  // mock the return value
    fs.existsSync.mockReturnValue(false);
    expect(
      fluidComponentPrefixer.getPrefixedContent(`${fixturePath}/withoutPrefix/withoutPrefix.scss`, 'rthrth-', true))
      .toBe(false);
    //mock.mockRestore();
  })
  */

});

test('it should return a hash value created out of the last segment of a scss file path ( the file name )', () => {
  const result = stringHash('usePrefixResult')
    .toString(36)
    .substr(0, 5) + '-';

  expect(
    fluidComponentPrefixer.buildPrefix(`${fixturePath}/usePrefixResult.scss`))
    .toBe(result);
});

test('it should return a hash value created out of the last segment of a scss file path ( the file name )', () => {
  const result = stringHash('usePrefixResult')
    .toString(36)
    .substr(0, 5) + '-';

  expect(
    fluidComponentPrefixer.buildPrefix(`${fixturePath}/usePrefixResult`))
    .toBe(result);
});

test('it should return the last segment of a path', () => {
  expect(fluidComponentPrefixer.getLastPathSegmentWithoutExtension(`${fixturePath}/usePrefixResult.scss`))
    .toBe('usePrefixResult');
});

test('it should get the foldername that a file lies in', () => {
  expect(fluidComponentPrefixer.getFolderPath(`${fixturePath}/usePrefixResult.scss`))
    .toBe(`${fixturePath}`);
});


test('it should return a path to a filename including a scss file extension', () => {
  fs.existsSync.mockReturnValue(true);
  expect(fluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(`${fixturePath}/usePrefixResult.scss`);
});


test('it should return a path to a filename including a scss file widht underscore extension', () => {
  fs.existsSync.mockReturnValueOnce(false);
  fs.existsSync.mockReturnValueOnce(true);
  expect(fluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(`${fixturePath}/_usePrefixResult.scss`);
});

test('it should return false', () => {
  fs.existsSync.mockReturnValueOnce(false);
  fs.existsSync.mockReturnValueOnce(false);
  expect(fluidComponentPrefixer.resolveFilePath(`${fixturePath}/usePrefixResult`))
    .toBe(false);
});

describe('writePrefixJson', () => {
  const fileName = `${fixturePath}/prefixJson/prefix.json`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('it should be able to call fs.writeFile', () => {
    fs.existsSync.mockReturnValueOnce(false);
    fluidComponentPrefixer.writePrefixJson(fileName, 'jfwioj')
    expect(fs.writeFile).toHaveBeenCalled();
  })

  it('it should not be able to call fs.writeFile', () => {
    fs.existsSync.mockReturnValueOnce(true);
    fluidComponentPrefixer.writePrefixJson(fileName, 'jfwioj')
    expect(fs.writeFile).toHaveBeenCalledTimes(0)
  })

});

describe('removePrefixJson', () => {
  const fileName = `${fixturePath}/prefixJson/prefix.json`;
  beforeEach(() => jest.resetModules());

  it('it should be able to call fs.unlink', () => {
    fs.existsSync.mockReturnValue(true);
    fluidComponentPrefixer.removePrefixJson(fileName)
      .then(console.log)
      .catch(data => ( console.log(data)  ))
    expect(fs.unlink).toHaveBeenCalled();
  })


});


