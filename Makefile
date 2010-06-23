
PREFIX = /usr/local

install: bin/dox
	cp -f $< $(PREFIX)/bin/dox

uninstall:
	rm -f $(PREFIX)/bin/dox

.PHONY: install uninstall