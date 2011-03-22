
test:
	@./support/expresso/bin/expresso \
	  -I support

docs:
	@./bin/dox \
	  --verbose \
	  lib/* \
	  --out /tmp/docs \
	  --title Dox \
	  --github visionmedia/dox \
	  --description "Dox is a documentation generator for [nodejs](http://nodejs.org)."

.PHONY: test docs