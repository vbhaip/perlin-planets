from selenium import webdriver
from random import random
import urllib
import os
import glob
import time

browser = webdriver.Firefox()

def count():
	return len(glob.glob(os.path.expanduser("~") + "/Downloads/*.gif"))


for i in range(0, 5):
	tot_time = 0
	curr = count()

	params = {}
	params['x_ax'] = random()
	params['y_ax'] = random()
	params['z_ax'] = random()

	params['x_of'] = random()*.02-.01
	params['y_of'] = random()*.02-.01
	params['z_of'] = random()*.02-.01

	params['r'] = int(random()*255)
	params['g'] = int(random()*255)
	params['b'] = int(random()*255)

	params['r_dev'] = int(random()*100)
	params['g_dev'] = int(random()*100)
	params['b_dev'] = int(random()*100)

	params["order"] = int(random()*6)

	loc = "localhost:8000?" + urllib.parse.urlencode(params)

	browser.get(loc)

	time.sleep(20)
	tot_time += 20

	while(count() == curr):
		print("Process has been running for " + str(tot_time) + " seconds...")
		time.sleep(10)
		tot_time += 10

	print("Finished " + str(i + 1) + " gif")

	#buffer time to wrap up any ongoing processes
	time.sleep(10)

