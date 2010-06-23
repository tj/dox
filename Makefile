
PREFIX = /usr/local

install: bin/dox
	cp -f $< $(PREFIX)/bin/dox
	cp -fr lib ~/.node_libraries/dox

uninstall:
	rm -f $(PREFIX)/bin/dox
	rm -fr ~/.node_libraries/dox

.PHONY: install uninstall