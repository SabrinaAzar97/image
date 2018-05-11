from Tkinter import *
from PIL import Image,ImageTk
root = Tk()
root.geometry("900x900+100+100")
image1 = Image.open("IMG_20160123_170503.jpg")
photoImg = ImageTk.PhotoImage(image1)
frame = Frame(root)
frame.pack()
text = Text(frame)
text.pack()
text.image_create(END,image=photoImg)
root.mainloop()