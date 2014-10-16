#!/usr/bin/zsh

function arxiv_url() {
  if [ $# = 1 ]; then
    if [[ $1 =~ "^[0-9]{4}\.[0-9]{4}" ]]; then
      echo $1
    elif [[ $1 =~ "^.*/[0-9]{7}$" ]]; then
      echo $1
    elif [[ $1 =~ "^[0-9]{7}$" ]]; then
      echo "hep-ph/$1"
    fi
  fi
}
i=$1
url=`arxiv_url $i`
if [ ! -z $url ]; then
  file=`echo $i | sed 's/\///g'`
  if [ `echo $file | egrep '^\d{7}'` ]; then
    file="hep-ph$file"
  fi
  if [ -s /var/tmp/$file.pdf ]; then
    echo /var/tmp/$file.pdf
    exit
  fi
  wget http://jp.arxiv.org/pdf/$url -U Mozilla -O $file.pdf
  if [ -s $file.pdf ]; then
    if head -1 $file.pdf | grep '<?xml' > /dev/null; then
      /bin/rm $file.pdf
      echo "RETRY"
      exit
    else
      /bin/mv $file.pdf /var/tmp
      echo /var/tmp/$file.pdf
      exit
    fi
  fi
fi
echo "FAIL"
