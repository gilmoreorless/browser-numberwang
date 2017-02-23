iconsrc := icons/n-256.png
iconsizes := {16,32,48,128}
icondir := icons
iconfiles := $(shell echo $(icondir)/n-$(iconsizes).png)


$(icondir)/n-%.png:
	@mkdir -p $(@D)
	convert $(iconsrc) -resize $* $@


icons: $(iconfiles)

.PHONY: icons
