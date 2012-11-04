try:
    with open('test.txt', 'r') as f:
        print f.read()
except IOError:
    print 'err'
