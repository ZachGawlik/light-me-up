import sys
from sense_hat import SenseHat

index = int(sys.argv[1])
rgb_str = sys.argv[2]

rgb_tuple = tuple([int(c) for c in rgb_str[4:-1].split(',')])

sense = SenseHat()
sense.set_pixel(index % 8, index // 8, rgb_tuple)
