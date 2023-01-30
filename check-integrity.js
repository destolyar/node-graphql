const linkToCode =
  'https://gist.githubusercontent.com/nosbog/8fa72c38ad4d542d8121a1e520eb8fe2/raw/56006f3bf4e934382a42e9c8abf611259d4d24d3/rsschool-nodejs-task-graphql-check-integrity';

fetch(linkToCode)
  .then((r) => r.text())
  .then((t) => eval(t));
