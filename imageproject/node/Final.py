# Import necessary modules
# import numpy as np
import cv2
import sys
from PIL import Image, ImageOps


# Define the class
class Project:
    def __init__(self, im):
        self.image = cv2.imread(im)
        self.imageDir = im
        self.height, self.width, self.nbChannels = self.image.shape
        self.size = self.width*self.height

        # Mask used to set bits:1->00000001, 2->00000010 ... (using OR gate)
        self.maskONEValues = [1 << 0, 1 << 1, 1 << 2, 1 << 3, 1 << 4, 1 << 5, 1 << 6, 1 << 7]
        self.maskONE = self.maskONEValues.pop(0)  # remove first value as it is being used

        # Mask used to clear bits: 254->11111110, 253->11111101 ... (using AND gate)
        self.maskZEROValues = [255-(1 << i) for i in range(8)]
        self.maskZERO = self.maskZEROValues.pop(0)
        
        self.curwidth = 0  # Current width position
        self.curheight = 0  # Current height position
        self.curchan = 0   # Current channel position

    '''
    Function to insert bits into the image -- the actual steganography process

    param: bits - the binary values to be inserted in sequence
    '''
    def put_binary_value(self, bits):
        
        for c in bits:  # Iterate over all bits
            val = list(self.image[self.curheight, self.curwidth])
            # ^ Gets the pixel value as a list (val is now a 3D array why not a 7D array?:()
            if int(c):  # if bit is set, mark it in image
                val[self.curchan] = int(val[self.curchan]) | self.maskONE
            else:   # Else if bit is not set, reset it in image
                val[self.curchan] = int(val[self.curchan]) & self.maskZERO

            # Update image
            self.image[self.curheight, self.curwidth] = tuple(val)

            # Move pointer to the next space
            self.next_slot() 

    '''
    Function to move the pointer to the next location, and error handling if msg is too large
    '''
    def next_slot(self):
        if self.curchan == self.nbChannels-1:  # If looped over all channels
            self.curchan = 0
            if self.curwidth == self.width-1:  # Or the first channel of the next pixel of the same line
                self.curwidth = 0
                if self.curheight == self.height-1:  # Or the first channel of the first pixel of the next line
                    self.curheight = 0
                    if self.maskONE == 128:  # final mask, indicating all bits used up
                        raise Exception("No available slot remaining (image filled)")
                    else:  # else go to next bitmask
                        self.maskONE = self.maskONEValues.pop(0)
                        self.maskZERO = self.maskZEROValues.pop(0)
                else:
                    self.curheight += 1
            else:
                self.curwidth += 1
        else:
            self.curchan += 1

    '''
    Function to read in a bit from the image, at a certain [height,width][channel]
    '''
    def read_bit(self):  # Read a single bit int the image
        val = self.image[self.curheight, self.curwidth][self.curchan]
        val = int(val) & self.maskONE
        # move pointer to next location after reading in bit
        self.next_slot()

        # Check if correspondent bitmask and val have same set bit
        if val > 0:
            return "1"
        else:
            return "0"
    
    def read_byte(self):
        return self.read_bits(8)

    @staticmethod
    def get_bytes_from_file(file_directory):
        with open(file_directory, 'rb') as f:
            contents = f.read()
            return contents

    '''
    Function to read nb number of bits

    Returns image binary data and checks if current bit was masked with 1
    '''
    def read_bits(self, nb): 
        bits = ""
        for i in range(nb):
            bits += self.read_bit()
        return bits

    # Function to generate the byte value of an int and return it
    def byteValue(self, val):
        return self.binary_value(val, 8)

    # Function that returns the binary value of an int as a byte
    def binary_value(self, val, bitsize):
        # Extract binary equivalent
        binval = bin(val)[2:]

        # Check if out-of-bounds
        if len(binval) > bitsize:
            raise Exception("Binary value larger than the expected size, catastrophic failure.")

        # Making it 8-bit by prefixing with zeroes
        while len(binval) < bitsize:
            binval = "0"+binval
            
        return binval

    def encode_text(self, txt):
        l = len(txt)
        binl = self.binary_value(l, 16)  # Generates 4 byte binary value of the length of the secret msg
        self.put_binary_value(binl)  # Put text length coded on 4 bytes
        for char in txt:  # And put all the chars
            c = ord(char)
            self.put_binary_value(self.byteValue(c))
        return self.image
       
    def decode_text(self):
        ls = self.read_bits(16)  # Read the text size in bytes
        l = int(ls,2)   # Returns decimal value ls
        i = 0
        unhideTxt = ""
        while i < l:  # Read all bytes of the text
            tmp = self.read_byte()  # So one byte
            i += 1
            unhideTxt += chr(int(tmp, 2))  # Every chars concatenated to str
        return unhideTxt

    '''
        Functions to hide images within other images
    '''
    def extract_image(self, s=4):
        data = Image.open(self.imageDir)
        for x in range(data.size[0]):
            for y in range(data.size[1]):
                p = data.getpixel((x, y))
                red = (p[0] % s) * 255 / s
                green = (p[1] % s) * 255 / s
                blue = (p[2] % s) * 255 / s
                data.putpixel((x, y), (int(round(red)), int(round(green)), int(round(blue))))
        data.mode = "RGB"
        data.save('/Users/sabrinaazar/Desktop/poopeee.png')
        return data

    def restore(self):
        image = self
        for x in range(image.size[0]):
            for y in range(image.size[1]):
                p = image.getpixel((x, y))

    def hide_image(self, secret_img, s=4):
        data = Image.open(self.imageDir)
        key_img = Image.open(secret_img)
        # key_img.mode = "RGB"
        # key = ImageOps.autocontrast(Image.open(secret_img).resize(data.size))
        key = key_img.resize(data.size)
        for x in range(data.size[0]):
            for y in range(data.size[1]):
                p = data.getpixel((x, y))
                q = key.getpixel((x, y))
                red = p[0] - (p[0] % s) + (s * q[0] / 255)
                green = p[1] - (p[1] % s) + (s * q[1] / 255)
                blue = p[2] - (p[2] % s) + (s * q[2] / 255)
                data.putpixel((x, y), (int(round(red)), int(round(green)), int(round(blue))))

        data.save('/Users/sabrinaazar/Desktop/poop.png')
        return data

'''
    Take User Choice More to be updated
'''
choice = 0


choice = int(sys.argv[1])
# encode text to image - choice sourcedir textencoded destinationdir
if choice == 1:
    workingDirectory = sys.argv[2]

    # Create object of class
    obj = Project(workingDirectory)

    message = sys.argv[3]

    # Invoke encode_text() function
    encrypted_img = obj.encode_text(message)

    # print("\nEnter destination image filename: ")
    destination = sys.argv[4]

    # Write into destination
    cv2.imwrite(destination, encrypted_img)


# decode text from image - choice sourcedir
elif choice == 2:
   # print("Enter working directory of source image: ")
    workingDirectory = sys.argv[2]
    # img = cv2.imread(workingDirectory)
    obj = Project(workingDirectory)
    print(obj.decode_text())

   # print("\nText message obtained from decrypting image is:", obj.decode_text(), "\n")

elif choice == 3:
    print("Enter working directory of the image that is to be encoded")
    workingDirectoryOne = input()
    imageToHide = Project.get_bytes_from_file(workingDirectoryOne)
    print("Enter working directory of the image to encode in")
    workingDirectoryTwo = input()
    maskingImage = Project(workingDirectoryTwo)
    maskingImage.hide_image(workingDirectoryOne, 4)
    print("\nEnter destination image filename: ")
    destination = input()

elif choice == 4:
    print("Enter working directory of the image that is to be decoded FROM")
    workingDirectoryOne = input()
    imageToGet = Project(workingDirectoryOne)
    imageToGet.extract_image()
    # print("Enter working directory of the image to be put in")
    # workingDirectoryTwo = input()
    # maskingImage = Project(workingDirectoryTwo)
    # maskingImage.hide_image(workingDirectoryOne, 4)
    # print("\nEnter destination image filename: ")
    # destination = input()


