
test:
	@./node_modules/.bin/expresso \
	  -I support

docs:
	@./bin/dox \
	  --verbose \
	  lib/* \
	  --out docs \
	  --title Dox \
	  --github visionmedia/dox \
	  --index index.md

doc-server:
	@./bin/dox \
		--server docs

.PHONY: test docs