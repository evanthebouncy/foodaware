import pprint
import json

def setify():
  gross_ingr = open('short_ingr_data.txt','r')
  lines = gross_ingr.readlines()

  aha = set()
  for line in lines:
    aha.add(line[0:-1])
  pprint.pprint(aha)

ingredients_data = open('short_ingr_data.txt','r')
ingr_lines = ingredients_data.readlines()

def parse_ingredients(ingr_lines):
  ret = dict()
  line_ctr = -1
  while line_ctr < len(ingr_lines)-1:
    line_ctr += 1
    cur_line = ingr_lines[line_ctr]
    if (cur_line[-2:] == ':\n'):
      category = cur_line[:-2]
      line_ctr, ret[category] = parse_ingredient(ingr_lines, line_ctr)
  return ret

def parse_ingredient(ingr_lines, line_ctr):
    line_ctr += 1
    ingr = []
    while ingr_lines[line_ctr] != '\n':
      ingr.append(ingr_lines[line_ctr][0:-1])
      line_ctr += 1
    ingr.sort()
    return line_ctr, ingr

ingredients = parse_ingredients(ingr_lines)
pprint.pprint(ingredients)

print '=========json file=========='
print 'var ingredients = ' + json.dumps(ingredients)
