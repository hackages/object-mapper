import {is, keys} from 'ramda';

interface Transform {
  key: string;
  transform: <T>(v: any, obj: T) => any;
  when?: <T>(v: any, obj: T) => any;
  default?: any;
}

type MapValue = string | string[] | Transform | Transform[];

interface Map {
  [key: string]: MapValue;
}

const transformString = <T>(
  acc: Partial<T>,
  mapValue: string,
  value: string
): Partial<T> => ({
  ...acc,
  [mapValue]: value
});

const transformObj = <T>(
  acc: Partial<T>,
  mapValue: Transform,
  value: string,
  obj: T
): Partial<T> => {
  const {
    key,
    transform: _transforn,
    default: _default,
    when
  } = mapValue as Transform;

  if (value && when(value, obj)) {
    return {...acc, [key]: _transforn(value, obj)};
  } else {
    return {...acc, ...(_default ? {[key]: _default} : {})};
  }
};

const transformArray = <T>(
  acc: Partial<T>,
  mapValue: string[] | Transform[],
  value: any,
  obj: T
): Partial<T> => ({
  ...acc,
  ...(mapValue as []).reduce((_acc, v) => transform(_acc, v, value, obj), {})
});

const transform = <T>(
  acc: Partial<T>,
  mapValue: MapValue,
  value: any,
  obj: T
): Partial<T> => {
  if (value && is(String, mapValue)) {
    return transformString(acc, mapValue as string, value);
  }

  if (value && is(Array, mapValue)) {
    return transformArray(acc, mapValue as string[] | Transform[], value, obj);
  }

  if (is(Object, mapValue)) {
    return transformObj(acc, mapValue as Transform, value, obj);
  }

  return acc;
};

export const mapper = <T>(obj: T, map: Map): Partial<T> => {
  return keys(map).reduce((acc, mapKey) => {
    const value = obj[mapKey];
    const mapValue = map[mapKey];

    return transform(acc, mapValue, value, obj);
  }, {});
};
