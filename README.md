# Working with git
 

## GET THE REPO

git clone https://github.com/cccarr/SENG299Group7.git


## GIT MERGING:
### CHECKOUT A NEW BRANCH:

git checkout -b \<branch_name\>


### OR CHECKOUT AN EXISTING BRANCH:

git checkout \<existing_branch_name\>


### MAKE SOME CHANGES TO A FILE CALLED "foo.txt"

* git add foo.txt
<<<<<<< HEAD
* git -m "Some commit message"
* git push origin \<branch_name\>
=======
* git commit -m "Some commit message"
* git push origin "branch name"
>>>>>>> master
* git pull
* git merge master
* git checkout master
* git merge "branch name"




