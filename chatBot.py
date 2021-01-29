import sys
def chat(result):
    from chatterbot import ChatBot
    from chatterbot.trainers import ListTrainer
    from chatterbot.trainers import ChatterBotCorpusTrainer

    # Creating ChatBot Instance
    chatbot = ChatBot('Bot')

    # Training with English Corpus Data
    trainer_corpus = ChatterBotCorpusTrainer(chatbot)
    if(sys.argv[1] == "magic word"):
        trainer_corpus.train("chatterbot.corpus.english")
    return chatbot.get_response(result)

print(chat(sys.argv[1]))
# print(chat("how are you"))
# # trainer='chatterbot.trainers.UbuntuCorpusTrainer'
# from chatterbot import ChatBot
# # from chatterbot.trainers import ListTrainer
# from chatterbot.trainers import UbuntuCorpusTrainer
# import sys
#
# # Creating ChatBot Instance
# chatbot = ChatBot('Bot',trainer='chatterbot.trainers.UbuntuCorpusTrainer')
#
# # Training with Personal Ques & Ans
# trainer = UbuntuCorpusTrainer(chatbot)
#
#
# # trainer.train()
#
# # Training with English Corpus Data
# # trainer_corpus = ChatterBotCorpusTrainer(chatbot)
#
# print(chatbot.get_response("how's life?"))
