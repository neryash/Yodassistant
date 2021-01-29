def chat(result):
    from chatterbot import ChatBot
    from chatterbot.trainers import ListTrainer
    from chatterbot.trainers import ChatterBotCorpusTrainer

    # Creating ChatBot Instance
    chatbot = ChatBot('Bot')

    # Training with Personal Ques & Ans
    training_data_simple = open('training_data/normal.txt').read().splitlines()
    training_data_personal = open('training_data/all.txt').read().splitlines()

    training_data = training_data_simple + training_data_personal

    trainer = ListTrainer(chatbot)
    trainer.train(training_data)

    # Training with English Corpus Data
    trainer_corpus = ChatterBotCorpusTrainer(chatbot)
    return chatbot.get_response(result)

print(chat("What's up?"))
