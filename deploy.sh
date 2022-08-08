#!/bin/bash


echo "Wich part do you want to deploy, write the answer"
echo "  1 -> safecycle-server"
echo "  2 -> safecycle-client"
echo "  3 -> safecycle-server & safecycle-client"

read choise



if [ "$choise" == "1" ] || [ "$choise" == "3" ]; then 
    cd "$PWD"/server/safecycle_server
    echo "$PWD"
    docker build -t safecycle-server .

    cd "$PWD"/../../docker_images/
    echo "$PWD"

    rm -rf ./safecycle-server-image.tar

    docker save -o safecycle-server-image.tar safecycle-server   

    # scp ./safecycle-server-image.tar  ubuntu@51.38.71.146:/home/ubuntu
fi

if [ "$choise" == "2" ] || [ "$choise" == "3" ]; then 
    cd "$PWD"/client/safecycle-client
    docker build -t safecycle-client .


    cd "$PWD"/../../docker_images/
    echo "$PWD"

    rm -rf ./safecycle-client-image.tar

    docker save -o safecycle-client-image.tar safecycle-client  

    # scp ./safecycle-client-image.tar  ubuntu@51.38.71.146:/home/ubuntu
fi


# scp ./safecycle-client-image.tar ./safecycle-server-image.tar  ubuntu@51.38.71.146:/home/ubuntu




