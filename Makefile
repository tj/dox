
PREFIX = /usr/local

install:
	cp -f bin/dox $(PREFIX)/bin/dox
	cp -fr lib ~/.node_libraries/dox

uninstall:
	rm -f $(PREFIX)/bin/dox
	rm -fr ~/.node_libraries/dox

.PHONY: install uninstall