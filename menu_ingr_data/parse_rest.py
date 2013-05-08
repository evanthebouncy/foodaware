import pprint
import json

restaurant_data = open('short_rest_data.txt','r')

rest_lines = restaurant_data.readlines()

def parse_restaurants(rests_lines):
  rest_groups = []
  one_rest_lines = []  
  for line in rests_lines:
    if line[0] == '#' and one_rest_lines != []:
      rest_groups.append(one_rest_lines)
      one_rest_lines = []
    else:
      if line[0] != '#':
        one_rest_lines.append(line)
  rest_groups.append(one_rest_lines)

  ret = []
  for rest in rest_groups:
    ret.append(parse_restaurant(rest))
  return ret

def parse_restaurant(rest_lines):
  ret = dict()
  line_ctr = -1
  while line_ctr < len(rest_lines)-1:
    line_ctr += 1

    cur_line = rest_lines[line_ctr]
    if (cur_line == 'name:\n'):
      line_ctr += 1
      ret['name'] = rest_lines[line_ctr][0:-1]
    if (cur_line == 'logo:\n'):
      line_ctr += 1
      ret['logo'] = rest_lines[line_ctr][0:-1]
    if (cur_line == 'addr:\n'):
      line_ctr += 1
      addr = []
      while rest_lines[line_ctr] != '\n':
        addr.append(rest_lines[line_ctr][0:-1])
        line_ctr += 1
      ret['addr'] = addr
    if (cur_line == 'phone:\n'):
      line_ctr += 1
      ret['phone'] = rest_lines[line_ctr][0:-1]
    
    if (rest_lines[line_ctr][0] == '='):
      break
  
  dishes_lines = rest_lines[line_ctr:]
  dishes = parse_dishes(dishes_lines)
  ret['dishes'] = dishes
  return ret

def parse_dishes(dishes_lines):
  dish_groups = []
  one_dish_lines = []  
  for line in dishes_lines:
    if line[0] == '=' and one_dish_lines != []:
      dish_groups.append(one_dish_lines)
      one_dish_lines = []
    else:
      if line[0] != '=':
        one_dish_lines.append(line)
  dish_groups.append(one_dish_lines)


  ret = []
  for dish in dish_groups:
    ret.append(parse_dish(dish))
  return ret

def parse_dish(dishes_lines):
#  print "FUUUUUUUUUUUUUUUUUUUUUUUUUCKKK"
#  pprint.pprint(dishes_lines)
  ret = dict()
  line_ctr = -1
  while line_ctr < len(dishes_lines)-1:
    line_ctr += 1
    cur_line = dishes_lines[line_ctr]
    if (cur_line == 'name:\n'):
      line_ctr += 1
      ret['name'] = dishes_lines[line_ctr][0:-1]
    if (cur_line == 'price:\n'):
      line_ctr += 1
      ret['price'] = dishes_lines[line_ctr][0:-1]
    if (cur_line == 'description:\n'):
      line_ctr += 1
      desc = ''
      while dishes_lines[line_ctr] != '\n':
        desc += dishes_lines[line_ctr][0:-1] + ' '
        line_ctr += 1
      ret['description'] = desc
    if (cur_line == 'image:\n'):
      line_ctr += 1
      ret['image'] = dishes_lines[line_ctr][0:-1]
    
    if (dishes_lines[line_ctr] == 'ingredients:\n'):
      line_ctr += 1
      ingr = []
      #print len(dishes_lines), "dishlines"
      while dishes_lines[line_ctr] != '\n' and line_ctr<len(dishes_lines)-1:
        ingr.append(dishes_lines[line_ctr][0:-1])
        line_ctr += 1
        #print line_ctr
      ret['ingredients'] = ingr
#  print "YOOOOOOOOOOOOOOOOUUUUUUUUUUUUUUU"
#  pprint.pprint(ret)
  return ret

parsed_restaurants = parse_restaurants(rest_lines)

#pprint.pprint(parsed_restaurants)
#print '===========json file============'
print 'var restaurants =',
print json.dumps(parsed_restaurants, indent=4)
