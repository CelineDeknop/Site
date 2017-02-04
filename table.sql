CREATE TABLE USER (
    User_ID INTEGER PRIMARY KEY,
    Password VARCHAR(40) NOT NULL,
    FirstName VARCHAR(40) NOT NULL,
    LastName VARCHAR(40) NOT NULL,
    Email VARCHAR(40) NOT NULL,
    Lvl INTEGER NOT NULL default 0,
    Date DATE NOT NULL,
    TemplateID INTEGER,
    FOREIGN KEY (TemplateID) REFERENCES CVTEMPLATE(Template_ID)
);

CREATE TABLE CV (
    CV_ID INTEGER PRIMARY KEY,
    UserID INTEGER NOT NULL,
    Phone VARCHAR(40) NOT NULL,
    Address VARCHAR(40) NOT NULL,
    Age INTEGER NOT NULL,
    FOREIGN KEY (UserID) REFERENCES USER(User_ID)
);

CREATE TABLE FORMATION (
	Formation_ID INTEGER PRIMARY KEY,
	CVID INTEGER NOT NULL,
	DateStart DATE NOT NULL,
	DateEND DATE NOT NULL,
	Decpription varchar(300),
	FOREIGN KEY (CVID) REFERENCES CV(CV_ID)
);

CREATE TABLE EXPERIENCE (
	Experience_ID INTEGER PRIMARY KEY,
	CVID INTEGER NOT NULL,
	DateStart DATE NOT NULL,
	DateEND DATE NOT NULL,
	Decpription varchar(300),
	Remarque varchar(300),
	FOREIGN KEY (CVID) REFERENCES CV(CV_ID)
);

CREATE TABLE CVTEMPLATE(
	Template_ID INTEGER PRIMARY KEY,
	Style INTEGER NOT NULL
);