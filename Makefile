
test:
	@./support/expresso/bin/expresso \
	  -I support

docs:
	@./bin/dox \
	  --verbose \
	  lib/* \
	  --out docs \
	  --title Dox \
	  --github visionmedia/dox \
	  --index index.md

.PHONY: test docs