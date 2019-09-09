# eslint-plugin-toplevel
An eslint plugin for disallow side effect at module toplevel

## Why?
Side effect in toplevel of a module are hard to reason, and [behave diffrently](https://developpaper.com/explain-the-difference-between-commonjs-and-es6-modules-in-cyclic-loading-processing/) in CommonJS and ES6 modules. And there is no way to import a module without it's side effects. Solution is simple: **Don't make side effect at top level**.

## Example
bad:
```JS
console.log('hello world');
let s=0;
for (let i=0;i<10;i++) {
  s += i;
}
console.log(s);
fetch('/api').then(res=>res.text()).then(console.log);
```

good:
```JS
export async function main() {
  console.log('hello world');
  let s=0;
  for (let i=0;i<10;i++) {
    s += i;
  }
  console.log(s);
  const res = await fetch('/api');
  console.log(await res.text());
}
```

## Rules
There are three rules in this plugin:
### no-toplevel-var
Disallow var usage at toplevel module.  
Goal of this rule is to prevent modules to have internal state.
### no-toplevel-let
similiar to `no-toplevel-var`
### no-toplevel-side-effect
Disallow any side effect at top level

## Contributing
I'd love to accept your patches and contributions to this project.  
There are many ways you can contribute. For example:
* Add tests
* Fix bugs
* Add option to ignore module.export assigns in `no-toplevel-side-effect` rule
* Add good documention
