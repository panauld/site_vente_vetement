/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/jsx-closing-bracket-location */
import React, { Component } from 'react'
import HeaderContainer from '../component/header-component'
import FooterContainer from '../component/footer-component'
import AccueilContainer from '../component/accueil-component'
import ShopContainer from '../component/shop'
import DetailContainer from '../component/details-component'
import InscriptionContainer from '../component/inscription-component'
import LoginContainer from '../component/login-component'
import HistoriqueContainer from '../component/historique'
import PanierContainer from '../component/panier-component'

class ApplicationContainer extends Component {
    constructor (props) {
        super(props)

        // Retrieve the last saved currentPage value from localStorage
        const savedPage = localStorage.getItem('currentPage')
        const isLog = localStorage.getItem('Log')
        const isAdmin = localStorage.getItem('Admin')
        const uId = localStorage.getItem('userId')
        const pId = localStorage.getItem('productId')
        const pFidelite = localStorage.getItem('programmeF')
        this.state = {
            currentPage: savedPage ? parseInt(savedPage, 10) : 0,
            Log: isLog ? JSON.parse(isLog) : false,
            Admin: isAdmin ? JSON.parse(isAdmin) : false,
            userId: uId,
            productId: pId ? parseInt(pId, 10) : 0,
            programmeF: pFidelite ? JSON.parse(pFidelite) : false
        }
    }

    componentDidMount () {
        window.addEventListener('beforeunload', this.handleBeforeUnload)
        window.addEventListener('unload', this.handleUnload)
    }

    componentWillUnmount () {
        window.removeEventListener('beforeunload', this.handleBeforeUnload)
        window.removeEventListener('unload', this.handleUnload)
    }

    handleUnload = () => {
        this.setState({ currentPage: 0 }, this.saveState)
    }

    handleAccueil = () => {
        this.setState({ currentPage: 0 }, this.saveState)
    }

    handleShop = () => {
        this.setState({ currentPage: 2 }, this.saveState)
    }

    handleHisto = () => {
        this.setState({ currentPage: 5 }, this.saveState)
    }

    handleLogin = () => {
        this.setState({ currentPage: 4 }, this.saveState)
    }

    handleDetail = (productId) => {
        this.setState({ currentPage: 1, selectedProductId: productId }, this.saveProductId)
    }

    handlePaniers = () => {
        this.setState({ currentPage: 6 }, this.saveState)
    }

    handleLoginSuccess = () => {
        this.handleShop()
        this.setState({ Log: true }, () => { this.saveLog() })
        this.saveIsAdmin()
    }

    handleLogOutSuccess = () => {
        this.setState({ Log: false, Admin: false, programmeF: false }, () => {
            this.saveIsAdmin()
            this.saveLog()
            this.saveFidelite()
        })
    }

    handleInscription = () => {
        this.setState({ currentPage: 3 }, this.saveState)
    }

    saveState = () => {
        // Save the currentPage value to localStorage
        localStorage.setItem('currentPage', this.state.currentPage.toString())
    }

    saveFidelite = () => {
        // Save the currentPage value to localStorage
        localStorage.setItem('programmeF', JSON.stringify(this.state.programmeF))
    }

    handleLog = (data) => {
        this.setState({ Log: data }, () => { this.saveLog() })
    }

    saveLog = () => {
        // Save the log value to localStorage
        localStorage.setItem('Log', JSON.stringify(this.state.Log))
    }

    saveIsAdmin = () => {
        // Save the admin value to localStorage
        localStorage.setItem('Admin', JSON.stringify(this.state.Admin))
    }

    saveUid = () => {
        // Save the admin value to localStorage
        localStorage.setItem('userId', this.state.userId.toString())
    }

    saveProductId = () => {
        localStorage.setItem('productId', this.state.productId.toString())
    }

    handleId = (data) => {
        this.setState({ userId: data }, () => { this.saveUid() })
    }

    admin = (admin) => {
        if (admin === true) {
            this.setState({ Admin: true }, () => { this.saveIsAdmin() })
        } else if (admin === false) {
            this.setState({ Admin: false }, () => { this.saveIsAdmin() })
        }
    }

    fidelite = (Pfidelite) => {
        console.log('le programme de fidelite est le suivant' + Pfidelite)
        this.setState({ programmeF: Pfidelite }, () => { this.saveFidelite() })
    }

    render () {
        const { currentPage, Admin, programmeF } = this.state

        return (
            <div>
                <HeaderContainer
                    onHomeClick={this.handleAccueil}
                    onCatalogueClick={this.handleShop}
                    onLoginClick={this.handleLogin}
                    isLoggedIn={this.state.Log}
                    onLogout={this.handleLogOutSuccess}
                    onHistoriqueClick={this.handleHisto}
                    isAdmin={Admin}
                    onPanierClick={this.handlePaniers}
                />

                {currentPage === 0 && <AccueilContainer onProductClicked={this.handleDetail} />}
                {currentPage === 1 && <DetailContainer productId={this.state.selectedProductId} userId={this.state.userId} isLog={this.state.Log} onPanier={this.handlePaniers} />}
                {currentPage === 2 && <ShopContainer admin={Admin} onProductClicked={this.handleDetail} />}
                {currentPage === 3 && <InscriptionContainer
                    onUserCreated={this.handleLoginSuccess}
                    pf={this.fidelite}
                />}
                {currentPage === 5 && <HistoriqueContainer />}
                {currentPage === 4 && <LoginContainer
                    onCreateAccountClick={this.handleInscription}
                    onLoginSuccess={this.handleLoginSuccess}
                    admin={this.admin}
                    programmeF={this.fidelite}
                    // eslint-disable-next-line react/jsx-handler-names
                    sendUserId={this.handleId}
                />}
                {currentPage === 6 && <PanierContainer uid={this.state.userId} pF={programmeF} />}
                <FooterContainer />
            </div>
        )
    }
}

export default ApplicationContainer
