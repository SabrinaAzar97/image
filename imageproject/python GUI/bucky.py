from Tkinter import *
import tkMessageBox

root = Tk()

# BUTTON IN A FRAME

# topFrame = Frame(root)
# topFrame.pack()
# bottomFrame = Frame(root)
# bottomFrame.pack(side=BOTTOM)

# button1 = Button(topFrame, text="Button 1", fg="red")
# button2 = Button(topFrame, text="Button 2", fg="blue")
# button3 = Button(topFrame, text="Button 3", fg="green")
# button4 = Button(bottomFrame, text="Button 4", fg="yellow")

# button1.pack(side=LEFT)
# button2.pack(side=LEFT)
# button3.pack(side=LEFT)
# button4.pack(side=BOTTOM)

######################################################################

# LAYOUTS with Texts

# one = Label(root, text="One", bg="red", fg="white")
# one.pack()
# two = Label(root, text="Two", bg="green", fg="black")
# two.pack(fill=X)
# three = Label(root, text="Three", bg="blue", fg="white")
# three.pack(side=LEFT, fill=Y)

######################################################################

# GRID LAYOUT

# label_1 = Label(root, text="Name", fg="red")
# label_2 = Label(root, text="Password")

# entry_1 = Entry(root)
# entry_2 = Entry(root)

# label_1.grid(row=0, sticky=E) # Sticky takes N (North) E (East) S (South) W (West)
# label_2.grid(row=1, sticky=E)
 
# entry_1.grid(row=0, column=1)
# entry_2.grid(row=1, column=1)

# c = Checkbutton(root, text="Keep me logged in")
# c.grid(columnspan=2)

######################################################################

# INTERACTION WITH WIDGETS, BINDING FUNCTIONS TO WIDGETS

# def printName(event):
#     print("Hello my name is OMar")

# button_1 = Button(root, text="Print Name")
# button_1.bind("<Button-1>", printName)
# button_1.pack()

######################################################################

# ADDING FRAME TO LISTEN TO MOUSE ACTION

# def leftClick(event):
#     print("Left")

# def rightClick(event):
#     print("Right")

# frame = Frame(root, width=300, height=250)
# frame.bind("<Button-1>", leftClick)
# frame.bind("<Button-2>", rightClick)

# frame.pack()

######################################################################

# CLASSES

# class OmarsButtons:
    
#     def __init__(self, master):
#         frame = Frame(master)
#         frame.pack()

#         self.printButton = Button(frame, text="Print Message", command=self.printMessage)
#         self.printButton.pack(side=LEFT)

#         self.quitButton = Button(frame, text="Quit", command=frame.quit)
#         self.quitButton.pack(side=LEFT)

#     def printMessage(self):
#         print("THIS WORKED!!!")

# b = OmarsButtons(root)

######################################################################

# DROP DOWN MENU

# def doNothing():
#     print("I DID NOTHING")

# dropdownMenu = Menu(root)
# root.config(menu=dropdownMenu)

# subMenu = Menu(dropdownMenu)
# dropdownMenu.add_cascade(label="File", menu=subMenu)
# subMenu.add_command(label="New Project..", command=doNothing)
# subMenu.add_command(label="New..", command=doNothing)
# subMenu.add_separator()
# subMenu.add_command(label="Exit", command=doNothing)

# editMenu = Menu(dropdownMenu)
# dropdownMenu.add_cascade(label="Edit", menu=editMenu)
# editMenu.add_command(label="Redo", command=doNothing)
# editMenu.add_command(label="Undo", command=doNothing)

# TOOL BAR

# toolbar = Frame(root, bg="blue")
# insertStuff = Button(toolbar, text="Insert Image", command=doNothing)
# insertStuff.pack(side=LEFT, padx=2, pady=2)
# printStuff = Button(toolbar, text="Print", command=doNothing)
# printStuff.pack(side=LEFT, padx=2, pady=2)

# toolbar.pack(side=TOP, fill=X)

# STATUS BAR AT THE BOTTOM

# status = Label(root, text="Preparing to do nothing...", bd=1, relief=SUNKEN, anchor=W)
# status.pack(side=BOTTOM, fill=X)

######################################################################

# MESSAGE BOX

# tkMessageBox.showinfo('Window Title', 'Hello ua bxer')

# answer = tkMessageBox.askquestion('Question 1', 'Are you good?')

# if answer == 'yes':
#     print(' * __ * ')

######################################################################

# DRAWING SHAPES

# canvas = Canvas(root, width=200, height=100)
# canvas.pack()

# blackLine = canvas.create_line(0, 0, 200, 50)
# redLine = canvas.create_line(0, 100, 200, 50, fill="red")
# greenBox = canvas.create_rectangle(25, 25, 130, 60, fill="green")

######################################################################

# ADDING IMAGING AND ICONS

# photo_1 = PhotoImage(file="jesus.png")
# label = Label(root, image=photo_1)
# label.pack()

######################################################################
root.mainloop()