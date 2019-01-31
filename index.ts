import {is, keys} from 'ramda';

interface Transform {
  key: string;
  transform: (v: any) => any;
  default?: any;
}
interface Map {
  [key: string]: string | string[] | Transform | Transform[];
}

const transformString = (acc: any, mapValue: string, value: string) => ({
  ...acc,
  [mapValue]: value,
});

const transformObj = (acc: any, mapValue: Transform, value: string) => {
  const {key, transform: _transforn, default: _default} = mapValue as Transform;

  if (value) {
    return {...acc, [key]: _transforn(value)};
  } else {
    return {...acc, ...(_default ? {[key]: _default} : {})};
  }
};

const transformArray = (acc, mapValue, value) => ({
  ...acc,
  ...(mapValue as []).reduce((_acc, v) => transform(_acc, v, value), {}),
});

const transform = (acc, mapValue, value) => {
  if (value && is(String, mapValue)) {
    return transformString(acc, mapValue as string, value);
  }

  if (value && is(Array, mapValue)) {
    return transformArray(acc, mapValue, value);
  }

  if (is(Object, mapValue)) {
    return transformObj(acc, mapValue as Transform, value);
  }

  return acc;
};

export const mapper = (obj: any, map: Map) => {
  return keys(map).reduce((acc, mapKey) => {
    const value = obj[mapKey];
    const mapValue = map[mapKey];

    return transform(acc, mapValue, value);
  }, {});
};
