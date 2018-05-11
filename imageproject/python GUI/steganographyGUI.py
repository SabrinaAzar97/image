import Tkinter as Tkr
from tkFileDialog import askopenfilename as OpenFile
from Tkinter import Tk
from PIL import ImageTk, Image
import sys as System

class OmarsButtons:
    def __init__(self, master):

        frame = Tkr.Frame(master, bg="#4682B4")
        frame.pack()
        frame.pack_propagate(0)
        frame.pack(fill=Tkr.BOTH, expand=1)

        self.frame_TOP = Tkr.Frame(frame, bg="#4682B4")
        self.frame_TOP.pack(side=Tkr.TOP, fill=Tkr.X)
        # #---------- TOP MENU ----------#
        self.topMenu = Tkr.Menu(frame)
        master.config(menu=self.topMenu)

        #---------- SUB MENU ----------#
        self.subMenu_1 = Tkr.Menu(self.topMenu)
        self.topMenu.add_cascade(label="File", menu=self.subMenu_1)
        self.subMenu_1.add_command(label="Add New Image", command=self.loadImage)
        self.subMenu_1.add_separator()
        self.subMenu_1.add_command(label="Save Image", command=self.doNothing)
        self.subMenu_1.add_command(label="Load Previous Image", command=self.doNothing)
        self.subMenu_1.add_separator()
        self.subMenu_1.add_command(label="Exit", command=self.exitApplication)
        
        #---------- TITLE ----------#
        self.title = Tkr.Label(self.frame_TOP, text="WELCOME TO STEGANOGRAPHY", font=("Helvetica", 16), bg="#D3D3D3")
        self.title.pack(pady=10, fill=Tkr.X)

        #---------- FILE NAME ----------#

        self.label_imageName = Tkr.Label(self.frame_TOP, text="Selected Image Path:", bg="#4682B4")
        self.label_imageName.pack(side=Tkr.LEFT, padx=15, anchor=Tkr.NW)

        self.frame_CENTER = Tkr.Frame(frame, height=350, bd=1, relief=Tkr.SUNKEN, bg="#D3D3D3")
        self.frame_CENTER.pack(fill=Tkr.BOTH, padx=15, pady=10)

        self.frame_Image = Tkr.Frame(self.frame_CENTER, width=250, height=250)
        self.frame_Image.pack(pady=40, side=Tkr.LEFT, padx=(40,0))

        self.frame_RIGHT_CENTER = Tkr.Frame(self.frame_CENTER, height=250, bg="blue")
        self.frame_RIGHT_CENTER.pack_propagate(0)
        self.frame_RIGHT_CENTER.pack(fill=Tkr.BOTH, pady=40, padx=(20,40))

        self.typeText = Tkr.Label(self.frame_RIGHT_CENTER, text="Enter Text", bg="#D3D3D3")
        self.typeText.pack(fill=Tkr.X, anchor=Tkr.NW)

        self.inputText = Tkr.Text(self.frame_RIGHT_CENTER, bg="#D3D3D3")
        self.inputText.pack(fill=Tkr.Y)

        self.frame_BOTTOM = Tkr.Frame(frame, height=50, bg="#4682B4")
        self.frame_BOTTOM.pack(fill=Tkr.BOTH)

        self.encrypt_Button = Tkr.Button(self.frame_BOTTOM, text="ENCRYPT", command=self.encrypt)
        self.encrypt_Button.pack(pady=1, side=Tkr.LEFT, padx=(270,10))

        self.decrypt_Button = Tkr.Button(self.frame_BOTTOM, text="DECRYPT", command=self.decrypt)
        self.decrypt_Button.pack(pady=1, side=Tkr.LEFT)

        self.status = Tkr.Label(frame, text="Preparing to do nothing...", bd=1, relief=Tkr.SUNKEN, anchor=Tkr.W, bg="#D3D3D3")
        self.status.pack(side=Tkr.BOTTOM, fill=Tkr.X)


    def encrypt(self):
        self.status.config(text="Encrypting Image...")

    def decrypt(self):
        self.status.config(text="Decrypting Image...")

    def printMessage(self):
        print("THIS WORKED!!!")
    
    def doNothing(self):
        print("I DID NOTHING")

    # Drop down menu defs
    def exitApplication(self):
        System.exit()

    def loadImage(self):
        Tk().withdraw() 
        filename = OpenFile() 
        name = filename[-9:]
        self.label_hello = Tkr.Label(self.frame_TOP, text=filename, bg="#4682B4")
        self.label_hello.pack(side=Tkr.LEFT)
        self.loadedImage = Tkr.PhotoImage(file=name)
        self.labelImage = Tkr.Label(self.frame_Image, image=self.loadedImage, width=250, height=250)
        self.labelImage.pack()
        
root = Tkr.Tk()
root.geometry("750x500") # Fixed size
root.resizable(0, 0)
b = OmarsButtons(root)

root.mainloop()