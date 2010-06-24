
PREFIX = /usr/local

install:
	cp -f bin/dox $(PREFIX)/bin/dox
	cp -fr lib ~/.node_libraries/dox

uninstall:
	rm -f $(PREFIX)/bin/dox
	rm -fr ~/.node_libraries/dox

docs: uninstall install
	dox --title "Dox Example" \
		--desc "This is an example using _dox_, how **cool!**" \
		lib/*.js > docs.html

.PHONY: install uninstall docs