
PREFIX = /usr/local

install:
	cp -f bin/dox $(PREFIX)/bin/dox
	cp -fr lib ~/.node_libraries/dox

uninstall:
	rm -f $(PREFIX)/bin/dox
	rm -fr ~/.node_libraries/dox

docs: uninstall install
	dox --title "Dox" \
		--desc "JavaScript documentation parser for [node](http://ndoejs.org)." \
		lib/*.js > docs.html

.PHONY: install uninstall docs