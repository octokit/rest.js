
files("*")
    .stat()
    .filter()
    .copy()
    .end();