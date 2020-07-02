# sudo chmod 765 ~/sync.sh
cd /root/bot.spddl.de && /usr/bin/git add --all .
cd /root/bot.spddl.de && /usr/bin/git commit -a -m "Automated daily commit"
# cd /root/bot.spddl.de && /usr/bin/git push -u origin master
cd /root/bot.spddl.de && /usr/bin/git push # origin master
# cd /root/bot.spddl.de && /usr/bin/git push https://github.com/spddl/bot.spddl.de.git master
# cd /root/bot.spddl.de && /usr/bin/git remote add origin https://github.com/spddl/bot.spddl.de.git